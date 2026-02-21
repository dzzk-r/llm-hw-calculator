> These sources document the technical evolution of a **React-based LLM hardware calculator** as it transitions from a functional tool to a sophisticated **architectural feasibility model**. The developer focuses on debunking **marketing-centric performance claims** by highlighting that raw compute power often fails to predict actual speeds due to **memory bandwidth** and **KV cache** constraints. Central to this development is the shift towards **brand-agnostic hardware profiles**, using aliases like **h10hm2** to represent specific edge accelerators while maintaining professional neutrality.
>
> The roadmap for version **v0.3** introduces a tiered interface designed to separate **operational basics**, **architectural realism**, and **strategic runtime analysis**. Key technical distinctions are made between **encoder-only workloads**, such as vision and speech tasks, and the more memory-intensive **autoregressive decoding** required for large language models. The documentation also details a competitive analysis of **edge SoC architectures**, specifically comparing the efficiency of **on-chip SRAM** against external memory solutions. Ultimately, the project serves as a **proof of architectural thinking**, positioning the developer as a systems expert capable of modeling complex **hardware-software bottlenecks**.

https://dzzk-r.github.io/llm-hw-calculator/

![SidePanel Screenshot](docs/screenshot-v0.2.png)

# LLM Hardware Calculator (React + Vite + Tailwind + Recharts)

KV-aware, edge-oriented LLM hardware sanity checker.

Designed to expose unrealistic marketing claims such as:

> "30B model, 128k context, 16GB DDR4, 20+ tok/s"

---

## Features

- Separate modeling of **weights vs KV cache**
- Realistic KV alignment and fragmentation modeling
- Engine presets (llama.cpp, vLLM, TRT-LLM)
- Compute-bound vs bandwidth-bound tok/s
- Sliding window realism
- Side panel scaling chart
- Local profile storage

---

## Demo

https://dzzk-r.github.io/llm-hw-calculator/


## Run locally
```bash
npm i
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy
This is a static Vite build. Most hosts use:
- Build command: `npm run build`
- Publish directory: `dist`
