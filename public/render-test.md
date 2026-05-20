# Render Test Cases

Her bloğu admin'de ayrı ayrı yapıştır → Preview'a bak → MODE yazıyor mu kontrol et.

---

## TEST 1 — Raw YAML prompt (beklenen: CODE mode)

```
name: image-generator
description: Creates photorealistic images from text
system_prompt: You are a professional photographer and image director.
model: claude-opus-4-5
temperature: 0.8
```

---

## TEST 2 — Fenced Python (beklenen: CODE mode)

````
```python
def fibonacci(n: int) -> list[int]:
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

print(fibonacci(10))
```
````

---

## TEST 3 — Raw JSON (beklenen: CODE mode)

```
{
  "model": "claude-opus-4-5",
  "max_tokens": 4096,
  "system": "You are a helpful assistant.",
  "messages": [{"role": "user", "content": "Hello"}]
}
```

---

## TEST 4 — Prose markdown (beklenen: PROSE mode)

```
## Prompt Engineering Temelleri

İyi bir prompt yazmak, modelin **bağlamı anlamasını** sağlar.

### Üç Temel Kural

1. Net ol — belirsizlik yanıltıcı çıktı üretir
2. Örnek ver — few-shot örnekler doğruluğu artırır
3. Çıktı formatını belirt — JSON, Markdown, liste gibi

> "The quality of your output is limited by the quality of your input."

Daha fazla bilgi için [Anthropic docs](https://docs.anthropic.com) sayfasına bakabilirsiniz.
```

---

## TEST 5 — Prose + embedded code block (beklenen: PROSE mode)

```
## Python ile Claude API

Aşağıdaki snippet stream'li yanıt alır:

```python
import anthropic
client = anthropic.Anthropic()
with client.messages.stream(
    model="claude-opus-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}]
) as s:
    for text in s.text_stream:
        print(text, end="", flush=True)
```

Bu yöntemi kullanarak token maliyetini takip edebilirsiniz.
```

---

## TEST 6 — JSONC / karışık prompt (beklenen: CODE mode)

```
story: A detective in 2045 Tokyo must solve crimes using AI witnesses
instructions: {
  "tone": "noir",
  "length": "2000 words",
  "perspective": "first person",
  "constraints": ["no explicit violence", "Japanese cultural accuracy"]
}
```

---

## TEST 7 — Tablo + liste prose (beklenen: PROSE mode)

```
## Model Karşılaştırması

| Model | Context | Speed |
|-------|---------|-------|
| claude-opus-4-5 | 200k | slow |
| claude-sonnet-4-5 | 200k | fast |
| claude-haiku-3-5 | 200k | fastest |

**Öneri:** Üretim ortamı için Sonnet, prototip için Haiku kullan.
```

---

## TEST 8 — Düz metin prompt (beklenen: CODE mode)

```
You are an expert software architect. When given a feature request, you will:
1. Identify potential edge cases
2. Propose a clean API design
3. Suggest relevant design patterns
4. Flag any security considerations

Always respond in structured markdown with clear sections.
```
