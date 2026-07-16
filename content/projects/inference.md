---
title: "Inference Systems Lab"
titleTr: "Inference Systems Lab"
description: "A self-hosted AI inference platform: web interface, API orchestration, and GPU-backed inference engines for LLMs and vision models."
descriptionTr: "Kendi sunucunda çalışan AI inference platformu: web arayüzü, API orkestrasyonu ve LLM/görü modelleri için GPU destekli inference motorları."
tech: ["Python", "C++", "llama.cpp", "Docker", "RunPod", "NVIDIA GPU"]
github: "https://github.com/aykutssert/inference-systems-lab"
image: "/projects/inference.webp"
order: 1
---

An end-to-end AI inference platform that takes a request from a business team all
the way to a benchmarked, monitored response. The goal was to run large language
and vision models on self-managed GPU infrastructure instead of paying per-token
API pricing.

## How it works

The workflow moves through five stages:

1. **Business Teams** submit a task through a simple web interface.
2. **Web Interface** collects the prompt/input and hands it to the backend.
3. **API & Orchestration** routes the request to the right engine and manages batching, queuing, and retries.
4. **Inference Engines** run the actual models - LLMs, vision models, and optimization passes.
5. **Results & Insights** return the response along with benchmarks and live monitoring.

## Infrastructure

Everything runs on containerized GPU compute with object storage underneath -
Docker for packaging, RunPod / NVIDIA GPUs for compute, and a storage layer for
model weights and artifacts. The stack is built to swap models in and out without
touching the orchestration layer.
