---
title: "File Upload Service"
titleTr: "File Upload Service"
description: "A scalable file upload/download service with presigned URLs, direct-to-object-store transfers, and async post-processing workers."
descriptionTr: "Presigned URL'ler, object store'a doğrudan transfer ve asenkron işleme worker'ları olan ölçeklenebilir dosya yükleme/indirme servisi."
tech: ["Go", "Docker", "PostgreSQL", "NATS", "SeaweedFS", "Observability"]
github: "https://github.com/aykutssert/file-upload-service"
image: "/projects/file-upload-service.webp"
order: 2
---

A production-style file service designed to keep large transfers off the API
servers. Clients upload and download directly to and from the object store using
presigned URLs, so the API only handles metadata and orchestration - not bytes.

## Upload paths

- **`/files/presigned-upload`** - the client gets a signed URL and uploads the file straight to the object store, bypassing the API entirely.
- **`/files/upload`** - a direct path through the API for smaller payloads.
- **`/callback`** - the object store notifies the API once an upload completes, which then writes metadata and enqueues post-processing.

## Download paths

- **`/files/presigned-download`** - signed URL straight from the object store.
- **`/files/{FILE_ID}`** - served through a CDN, ideal for public/static files.

## Async processing

After each upload the service enqueues a job onto a queue (NATS). Background
workers then run virus scanning, thumbnail and preview generation, OCR, and
validation - all decoupled from the request path so uploads stay fast.

## Stack

Go for the service, PostgreSQL for files/metadata, SeaweedFS as the object store,
NATS for the work queue, all containerized with observability wired in.
