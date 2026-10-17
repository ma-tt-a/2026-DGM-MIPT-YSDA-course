---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 6"
author: Roman Isachenko
aspectRatio: 16/9
canvasWidth: 1280
colorSchema: light
fonts:
  sans: Arial
  serif: Georgia
  mono: Menlo
  provider: none
transition: none
drawings:
  enabled: true
  persist: false
  presenterOnly: false
  syncAll: true
download: false
info: false
favicon: "data:,"
clicks: 0
id: deep-generative-models
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 6</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
id: recap-of-previous-lecture
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Objective

$$
\min_{\btheta}\max_{\bphi}\left[\bbE_{\pd(\bx)}\log D_{\bphi}(\bx)+\bbE_{p(\bz)}\log(1-D_{\bphi}(\bG_{\btheta}(\bz)))\right]
$$

</div>

<div class="block">

## Optimal Discriminator and Jensen-Shannon Divergence

For fixed $G$, write the bracketed objective as $V(G,D)$:

$$
D^*(\bx)=\frac{\pd(\bx)}{\pd(\bx)+\pt(\bx)},\qquad
V(G,D^*)=2\,\JSD(\pd(\bx)\,\|\,\pt(\bx))-2\log2.
$$

</div>

<img src="/figs/gan_1.png" alt="GAN mode collapse during training" style="height: 160px; width: 100%; object-fit: contain;" />

Mode collapse refers to the phenomenon where the generator in a GAN produces only one or a few different modes of the distribution.


<div class="source"><a href="https://arxiv.org/abs/1406.2661">Goodfellow I. J. et al. Generative Adversarial Networks, 2014</a><br><a href="https://arxiv.org/abs/1611.02163">Metz L. et al. Unrolled Generative Adversarial Networks, 2016</a></div>

---
clicks: 0
id: recap-of-previous-lecture-2
class: theorems
---

# Recap of Previous Lecture

GAN losses also train the reconstruction stage of a **latent generative model**.

<div class="block">

## Stage 1: Train the Autoencoder

A fixed pretrained network $F$ defines the perceptual loss for reconstruction $\hat{\bx}$:

$$
\cL_{\text{perc}}=\|F(\bx)-F(\hat{\bx})\|_2^2.
$$

Train a discriminator $D$ to separate real and reconstructed image patches; train the autoencoder to fool $D$.

A KL-autoencoder also uses weak KL regularization.

</div>
<div class="block">

## Stage 2: Freeze the Autoencoder and Learn a Prior

Fit the distribution of its latent codes — the **aggregated posterior**.

**VQGAN:** sample a code map $\bc$ from an AR prior, look up its embeddings $\bz_q(\bc)$, then decode.

$$
\bc\sim p_{\bpsi}(\bc)\;\longrightarrow\;\bz_q(\bc)\;\longrightarrow\;\hat{\bx}.
$$

**KL-autoencoder:** a diffusion prior over continuous latents.

$$
\bepsilon\sim\cN(\bzero,\bI)\;\longrightarrow\;\bz\sim p_{\bpsi}(\bz)\;\longrightarrow\;\hat{\bx}.
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2012.09841">Esser P., Rombach R., Ommer B. Taming Transformers for High-Resolution Image Synthesis, 2021</a><br><a href="https://arxiv.org/abs/2112.10752">Rombach R. et al. High-Resolution Image Synthesis with Latent Diffusion Models, 2022</a></div>

<!--
The preceding GAN objective now supplies the adversarial reconstruction criterion. Recall the two distinct stages: train perceptual/adversarial reconstruction, then freeze the representation and learn its code distribution for generation. VQGAN and the KL-autoencoder are examples, not an exhaustive taxonomy. The next recap returns to the limitations of the standard GAN objective and motivates Wasserstein distance. A separate slide is needed because the existing GAN/theoretical-results recaps concern distribution matching and collapse, not the two-stage latent construction; appending the full perceptual formula and both sampling chains would mix topics and crowd those slides. The feature loss is the same schematic expression as in the preceding body; F stays frozen while gradients pass through it, whereas D is trained. Diffusion is only a prior-family pointer, not a new algorithm here. Weak KL does not guarantee a Gaussian aggregated posterior.
-->

---
clicks: 0
id: recap-of-previous-lecture-3
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Standard GAN Objective

$$
\min_{\btheta}\max_{\bphi}\left[\bbE_{\pd(\bx)}\log D_{\bphi}(\bx)+\bbE_{p(\bz)}\log(1-D_{\bphi}(\bG_{\btheta}(\bz)))\right]
$$

</div>
<div class="block">

## Theoretical Results

- Both the data distribution $\pd(\bx)$ and the generative distribution $\pt(\bx)$ are supported on low-dimensional manifolds.
- If $\pd(\bx)$ and $\pt(\bx)$ are disjoint, a smooth optimal discriminator can exist!

For such low-dimensional, disjoint manifolds:

$$
\KL(\pd\,\|\,\pt)=\KL(\pt\,\|\,\pd)=\infty,\qquad\JSD(\pd\,\|\,\pt)=\log2
$$

</div>


<div class="source"><a href="https://arxiv.org/abs/1904.08994">Weng L. From GAN to WGAN, 2019</a><br><a href="https://arxiv.org/abs/1701.04862">Arjovsky M., Bottou L. Towards Principled Methods for Training Generative Adversarial Networks, 2017</a></div>

---
clicks: 0
id: recap-of-previous-lecture-4
class: theorems
---

# Recap of Previous Lecture

<img src="/figs/discrete_wasserstein.png" alt="Transport plan between two discrete distributions" style="height: 130px; width: 100%; object-fit: contain;" />

<div class="block">

## Wasserstein Distance

$$
\begin{aligned}
W(\pi\|p)&=\inf_{\gamma\in\Gamma(\pi,p)}\bbE_{(\bx_1,\bx_2)\sim\gamma}\|\bx_1-\bx_2\|\\
&=\inf_{\gamma\in\Gamma(\pi,p)}\int\|\bx_1-\bx_2\|\gamma(\bx_1,\bx_2)d\bx_1d\bx_2
\end{aligned}
$$

- $\gamma(\bx_1,\bx_2)$ is the transport plan: the amount of “dirt” assigned from $\bx_1$ to $\bx_2$.
- $\Gamma(\pi,p)$ denotes the set of all joint distributions $\gamma(\bx_1,\bx_2)$ with marginals $\pi$ and $p$ ($\int\gamma(\bx_1,\bx_2)d\bx_1=p(\bx_2)$, $\int\gamma(\bx_1,\bx_2)d\bx_2=\pi(\bx_1)$).
- $\gamma(\bx_1,\bx_2)$ is the mass, $\|\bx_1-\bx_2\|$ is the distance.

</div>


<div class="source"><a href="https://udlbook.github.io/udlbook/">Simon J.D. Prince. Understanding Deep Learning, 2023</a><br><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 0
id: recap-of-previous-lecture-5
class: theorems
---

# Recap of Previous Lecture

On a compact data space $\cX$:

<div class="block">

## Dependence on Generator Parameters

For a feedforward generator $\bG_{\btheta}$ with Lipschitz activations and $\bbE_{p(\bz)}\|\bz\|<\infty$, $W(\pd\|\pt)$ is continuous in $\btheta$ and differentiable almost everywhere.

</div>

<div>

<div class="block">

## Convergence of Distributions

For a fixed distribution $\pi$ and a sequence $p_t$ on $\cX$, as $t\to\infty$:

$$
\KL(\pi\|p_t)\to0
\quad\Longrightarrow\quad\JSD(\pi\|p_t)\to0
\quad\Longrightarrow\quad W(\pi\|p_t)\to0
$$

The first implication also holds for $\KL(p_t\|\pi)\to0$; the converses need not hold.

</div>

<div class="takeaway">

**Wasserstein can capture distributions getting closer even when their supports do not overlap.**

</div>

</div>

<div class="source"><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

<!-- The preceding parallel-lines example in Lecture 5 illustrates both properties. Continuity and almost-everywhere differentiability do not guarantee a nonzero gradient or successful WGAN training. The generator statement uses the feedforward-network corollary in the cited paper; its conditions include standard affine layers and Lipschitz activations. -->

---
clicks: 0
id: recap-of-previous-lecture-6
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Theorem (Kantorovich-Rubinstein Duality)

$$
W(\pd\|\pt)=\frac1K\max_{\|f\|_L\leq K}\left[\bbE_{\pd(\bx)}f(\bx)-\bbE_{\pt(\bx)}f(\bx)\right],
$$

where $f:\bbR^m\rightarrow\bbR$ is $K$-Lipschitz continuous ($\|f\|_L\leq K$).

</div>
<div class="block">

## WGAN Objective

$$
\min_{\btheta}{\color{#8854c0}W(\pd\|\pt)}\approx\min_{\btheta}{\color{#8854c0}\max_{\bphi\in\bPhi}\left[\bbE_{\pd(\bx)}f_{\bphi}(\bx)-\bbE_{p(\bz)}f_{\bphi}(\bG_{\btheta}(\bz))\right]}.
$$

</div>

- The discriminator $D$ is replaced by function $f$: in WGAN, it is known as the **critic**, which is *not* a classifier.
- If the weights $\bphi$ are restricted to a compact set $\bPhi=[-c,c]^d$, then $f_{\bphi}(\bx)$ is $K$-Lipschitz continuous.

$$
\begin{aligned}
K\cdot W(\pd\|\pt)&=\max_{\|f\|_L\leq K}\left[\bbE_{\pd(\bx)}f(\bx)-\bbE_{\pt(\bx)}f(\bx)\right]\\
&\geq\max_{\bphi\in\bPhi}\left[\bbE_{\pd(\bx)}f_{\bphi}(\bx)-\bbE_{\pt(\bx)}f_{\bphi}(\bx)\right]
\end{aligned}
$$


<div class="source"><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 0
id: recap-of-previous-lecture-7
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Frechet Inception Distance (FID)

Use Inception image embeddings $\bz=\bff(\bx)$; compare Gaussian approximations of their distributions:

$$
\begin{aligned}
\FID(\pd,\pt)&=\|\bmu_{\text{data}}-\bmu_{\btheta}\|^2\\
&\quad+\tr\left[\bSigma_{\text{data}}+\bSigma_{\btheta}-2\left(\bSigma_{\text{data}}^{1/2}\bSigma_{\btheta}\bSigma_{\text{data}}^{1/2}\right)^{1/2}\right].
\end{aligned}
$$

FID depends on the feature network, Gaussian approximation and sample size; it may not correlate with human evaluation.

</div>
<div class="block">

## CMMD: Comparing CLIP Image Embeddings

For CLIP image-embedding distributions $P,Q$, use a Gaussian kernel $k$:

$$
\MMD_k^2(P,Q)=\bbE k(\bz,\bz')+\bbE k(\bw,\bw')-2\bbE k(\bz,\bw).
$$

Here $\bz,\bz'\sim P$ and $\bw,\bw'\sim Q$ are mutually independent. This compares more than means and covariances.

</div>

<div class="source"><a href="https://arxiv.org/abs/1706.08500">Heusel M. et al. GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium, 2017</a><br><a href="https://arxiv.org/abs/2401.09603">Jayasumana S. et al. Rethinking FID: Towards a Better Evaluation Metric for Image Generation, 2024</a></div>

---
clicks: 0
id: recap-of-previous-lecture-8
class: theorems
---

# Recap of Previous Lecture

- $\cS_{\text{data}}=\{\bx_i\}_{i=1}^n\sim\pd(\bx)$ - real samples;
- $\cS_{\btheta}=\{\bx_i\}_{i=1}^n\sim\pt(\bx)$ - generated samples.

Define a binary function:

$$
\bbI(\bx,\cS)=\begin{cases}1,&\text{if }\exists\,\bx'\in\cS:\|\bx-\bx'\|_2\leq\|\bx'-\NN_k(\bx',\cS)\|_2;\\0,&\text{otherwise.}\end{cases}
$$

$$
\text{Pr}(\cS_{\text{data}},\cS_{\btheta})=\frac1n\sum_{\bx\in\cS_{\btheta}}\bbI(\bx,\cS_{\text{data}});\quad\text{Rec}(\cS_{\text{data}},\cS_{\btheta})=\frac1n\sum_{\bx\in\cS_{\text{data}}}\bbI(\bx,\cS_{\btheta}).
$$

<img src="/figs/pr_k_nearest.png" alt="Precision and recall from nearest-neighbor manifolds" style="height: 165px; width: 100%; object-fit: contain;" />

Embed the samples using a pretrained network (as in FID).


<div class="source"><a href="https://arxiv.org/abs/1904.06991">Kynkäänniemi T. et al. Improved precision and recall metric for assessing generative models, 2019</a></div>

---
clicks: 0
id: recap-of-previous-lecture-9
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## CLIP: Learn from Image–Caption Pairs

$$
s_{\text{CLIP}}(\bx,t)=\cos\!\left(\bff_{\text{img}}(\bx),\bff_{\text{text}}(t)\right).
$$

</div>

**PickScore** learns human preferences; **VQAScore / GenEval / DPG-Bench** assess compositional correctness beyond CLIP similarity.

<div class="takeaway">

## Human Evaluation

**No automated metric is perfect.** Validate model quality with human judgments across multiple criteria.

For image editing, assess:

1. **Instruction relevance:** Was the requested change made?
2. **Preservation:** Did content that should stay unchanged remain intact?
3. **Visual defects:** Were artifacts or distortions introduced?

</div>

<div class="source"><a href="https://arxiv.org/abs/2103.00020">Radford A. et al. Learning Transferable Visual Models From Natural Language Supervision, 2021</a> · <a href="https://arxiv.org/abs/2305.01569">Kirstain Y. et al. Pick-a-Pic, 2023</a><br><a href="https://arxiv.org/abs/2404.01291">Lin Z. et al. Evaluating Text-to-Visual Generation with Image-to-Text Generation, 2024</a><br><a href="https://arxiv.org/abs/2310.11513">Ghosh D. et al. GenEval, 2023</a> · <a href="https://arxiv.org/abs/2403.05135">Hu X. et al. ELLA (DPG-Bench), 2024</a> · <a href="https://habr.com/ru/companies/yandex/articles/1058630/">Yandex. Alice AI ART 2.0</a></div>

<!--
Merged the learned-metric and human-evaluation recaps at the author's request.
The full Alice AI ART 2.0 illustration remains in the preceding lecture's body;
this recap retains its three image-editing criteria without repeating the examples.
-->

---
clicks: 0
id: outline
class:
---

# Outline

<div class="course-outline">
<div class="outline-item"><span>01</span><div>Langevin Dynamics</div></div>

<div class="outline-item"><span>02</span><div>Score Matching<div class="outline-sub">Denoising Score Matching<br>Noise-Conditioned Score Network (NCSN)</div></div></div>
<div class="outline-item"><span>03</span><div>Forward Gaussian Diffusion Process</div></div>

</div>

---
clicks: 0
id: outline-2
section: "Langevin Dynamics"
class:
---

# Outline

<div class="course-outline">
<div class="outline-item current"><span>01</span><div>Langevin Dynamics</div></div>

<div class="outline-item"><span>02</span><div>Score Matching<div class="outline-sub">Denoising Score Matching<br>Noise-Conditioned Score Network (NCSN)</div></div></div>
<div class="outline-item"><span>03</span><div>Forward Gaussian Diffusion Process</div></div>

</div>

---
clicks: 2
id: energy-based-models
class: theorems
---

# Energy-Based Models

<div class="block">

## Unnormalized Density

$$
\pt(\bx)=\frac{\hat p_{\btheta}(\bx)}{Z_{\btheta}},\qquad\text{where }Z_{\btheta}=\int\hat p_{\btheta}(\bx)d\bx
$$

- $\hat p_{\btheta}(\bx)$ can be any non-negative function.
- If we reparameterize as $\hat p_{\btheta}(\bx)=\exp(-f_{\btheta}(\bx))$, we eliminate the non-negativity constraint.

</div>
<div class="block" v-click="1">

## Log-Density Gradient

The gradient of the normalized log-density equals that of the unnormalized log-density:

$$
\nabla_{\bx}\log\pt(\bx)=\nabla_{\bx}\log\hat p_{\btheta}(\bx)-\nabla_{\bx}\log Z_{\btheta}=\nabla_{\bx}\log\hat p_{\btheta}(\bx)
$$

</div>
<div v-click="2">

- Suppose we already have this density (normalized or not) $\pt(\bx)$.
- How can we sample from the model?

</div>

<div class="source"><a href="https://yann.lecun.org/exdb/publis/pdf/lecun-06.pdf">LeCun Y. et al. A Tutorial on Energy-Based Learning, 2006</a></div>

---
clicks: 2
id: langevin-dynamics
class: theorems
---

# Langevin Dynamics

<div class="block">

## Theorem (Informal)

Let $\bx_0$ be a random vector. Under mild regularity conditions, samples from the following dynamics will eventually follow $\pt(\bx)$ (for sufficiently small $\eta$ and large $l$):

$$
\bx_{l+1}=\bx_l+\frac\eta2\cdot\nabla_{\bx_l}\log\pt(\bx_l)+\sqrt\eta\cdot\bepsilon_l,\qquad\bepsilon_l\sim\cN(0,\bI).
$$

</div>
<div class="columns balanced" v-click="1" style="grid-template-columns: 1.2fr 1fr;">
<div>

- What if $\bepsilon_l=\bzero$?
- The density $\pt(\bx)$ is the **stationary** distribution of the Markov chain.
- The gradient is taken with respect to $\bx$, not $\btheta$.
- $\nabla_{\bx}\log\pt(\bx)$ defines a vector field.

</div>
<img src="/figs/langevin_dynamic.png" alt="Langevin trajectories move along the score vector field" style="height: 240px; width: 100%; object-fit: contain;" />
</div>


<div class="takeaway" v-click="2">

**Knowing $\pt(\bx)$ up to a normalizing constant lets us use Langevin dynamics to obtain approximate samples $\bx_l\sim\pt$ for large $l$.**

</div>

<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The principles of diffusion models, 2025.</a></div>

---
clicks: 0
id: langevin-dynamics-why-add-noise
class: interactive-slide
---

<script setup>
import LangevinDemo from '../lecture5/components/LangevinDemo.vue'
</script>

# Langevin Dynamics: Why Add Noise?

$$
\pt(\bx)=\tfrac12\cN(\bmu_-,0.7^2\bI)+\tfrac12\cN(\bmu_+,0.7^2\bI),\qquad\bmu_\pm=(\pm1.5,0),\quad\eta=0.04.
$$

<LangevinDemo />

<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The Principles of Diffusion Models, 2025</a></div>

<!-- Exact score of an equally weighted two-component isotropic Gaussian mixture; no learned network. Step uses x <- x + eta/2 * score(x) + sqrt(eta) * epsilon with independent standard normal noise in both coordinates, matching the preceding formula. Start with Noise off and run: particles approach the two density modes. Turn Noise on (same initial particles and seed), run, and compare the x_1 histogram against its exact marginal. This finite unadjusted Langevin simulation is approximate; fixed nonzero eta generally biases the invariant distribution, and finite time/particles create further error. Contours are exact density level sets; arrow lengths are compressed for readability but directions are those of the score. Particles are never clipped or reflected; counts outside the visible field/histogram are disclosed. PDF compares deterministic runs after 300 steps. Each run is capped at 300 steps. Run pauses when leaving the slide, while coordinates and RNG state persist. -->

---
clicks: 0
id: outline-3
section: "Score Matching"
class:
---

# Outline

<div class="course-outline">
<div class="outline-item"><span>01</span><div>Langevin Dynamics</div></div>

<div class="outline-item current"><span>02</span><div>Score Matching<div class="outline-sub">Denoising Score Matching<br>Noise-Conditioned Score Network (NCSN)</div></div></div>
<div class="outline-item"><span>03</span><div>Forward Gaussian Diffusion Process</div></div>

</div>

---
clicks: 0
id: generative-models-taxonomy
class: theorems
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" score-matching />

---
clicks: 1
id: score-function
class: theorems
---

# Score Function

$$
\bs_{\btheta}(\bx)=\nabla_{\bx}\log\pt(\bx)
$$

<img src="/figs/score_function.png" alt="Density and corresponding score vector field" style="height: 245px; width: 100%; object-fit: contain;" />

<div class="block" v-click="1">

## Langevin Dynamics

$$
\begin{aligned}
\bx_{l+1}&=\bx_l+\frac\eta2\cdot\nabla_{\bx_l}\log\pd(\bx_l)+\sqrt\eta\cdot\bepsilon_l\\
&\approx\bx_l+\frac\eta2\cdot{\color{#8854c0}\nabla_{\bx_l}\log\pt(\bx_l)}+\sqrt\eta\cdot\bepsilon_l\\
&=\bx_l+\frac\eta2\cdot{\color{#8854c0}\bs_{\btheta}(\bx_l)}+\sqrt\eta\cdot\bepsilon_l.
\end{aligned}
$$

</div>


<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The principles of diffusion models, 2025.</a></div>

---
clicks: 2
id: score-matching
class: theorems
---

# Score Matching

<img src="/figs/smld.jpg" alt="Score estimation and Langevin sampling" style="height: 270px; width: 100%; object-fit: contain;" />

<div class="block" v-click="1">

## Fisher Divergence

$$
\begin{aligned}
D_F(\pd,\pt)&=\frac12\bbE_{\pd}\big\|\nabla_{\bx}\log\pt(\bx)-\nabla_\bx\log\pd(\bx)\big\|_2^2\\
&=\frac12\bbE_{\pd}\big\|\bs_{\btheta}(\bx)-\nabla_\bx\log\pd(\bx)\big\|_2^2\rightarrow\min_{\btheta}
\end{aligned}
$$

</div>
<div v-click="2">

**Problem:** We don't know $\nabla_\bx\log\pd(\bx)$.

</div>


<div class="source"><a href="https://yang-song.github.io/blog/2021/score/">Song Y. Generative Modeling by Estimating Gradients of the Data Distribution, blog post, 2021</a></div>

---
clicks: 1
id: why-is-the-score-function-better-than-the-density
class: theorems
---

# Why Is the Score Function Better than the Density?

<div class="block">

## Freedom from Normalization Constants

Many distributions are defined only up to an unnormalized density $\hat p(\bx)$:

$$
\nabla_{\bx}\log p(\bx)=\nabla_{\bx}\log\hat p(\bx)-\underbrace{\nabla_{\bx}\log Z}_{=0}=\nabla_{\bx}\log\hat p(\bx)
$$

The score function bypasses the intractable constant $Z$ entirely!

</div>
<div class="block" v-click="1">

## A Complete Representation

The score $\bs(\bx)=\nabla_{\bx}\log p(\bx)$ determines $\log p(\bx)$ up to the additive constant $\log p(\bx_0)$:

$$
\log p(\bx)=\log p(\bx_0)+\int_0^1\bs(\bx_0+t(\bx-\bx_0))^\top(\bx-\bx_0)dt
$$

Modeling $\bs(\bx)$ is as expressive as modeling $p(\bx)$ itself, while often more tractable for generative modeling.

</div>


<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The principles of diffusion models, 2025.</a></div>

---
clicks: 0
id: outline-4
section: "Denoising Score Matching"
class:
---

# Outline

<div class="course-outline">
<div class="outline-item"><span>01</span><div>Langevin Dynamics</div></div>

<div class="outline-item current"><span>02</span><div>Score Matching<div class="outline-sub"><b>Denoising Score Matching</b><br>Noise-Conditioned Score Network (NCSN)</div></div></div>
<div class="outline-item"><span>03</span><div>Forward Gaussian Diffusion Process</div></div>

</div>

---
clicks: 3
id: denoising-score-matching
class: theorems
---

# Denoising Score Matching

Let us perturb the original data $\bx\sim\pd(\bx)$ with Gaussian noise:

$$
\bx_{\sigma}=\bx+\sigma\cdot\bepsilon,\quad\bepsilon\sim\cN(0,\bI),\quad q(\bx_{\sigma}|\bx)=\cN(\bx,\sigma^2\cdot\bI)
$$

<div v-click="1">

$$
q(\bx_{\sigma})=\int q(\bx_{\sigma}|\bx)\pd(\bx)d\bx.
$$

</div>
<div class="block" v-click="2">

## Assumption

The solution to

$$
\frac12\bbE_{q(\bx_{\sigma})}\big\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\big\|_2^2\rightarrow\min_{\btheta}
$$

satisfies $\bs_{\btheta,\sigma}(\bx_{\sigma})\approx\bs_{\btheta,0}(\bx_0)=\bs_{\btheta}(\bx)$ if $\sigma$ is sufficiently small.

</div>
<div v-click="3">

- For small $\sigma$, the noisy-data score $\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})$ nearly matches the original-data score $\nabla_{\bx}\log\pd(\bx)$.
- The score function $\bs_{\btheta,\sigma}(\bx_{\sigma})$ is parameterized by $\sigma$.
- **Note:** We don't know $q(\bx_{\sigma})$, just as we don't know $\pd(\bx)$.

</div>


<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a></div>

---
clicks: 3
id: denoising-score-matching-2
class: theorems
---

# Denoising Score Matching

We cannot evaluate the marginal score $\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})$. The theorem lets us replace it in the training objective with the conditional score $\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)$.

<div class="block">

## Theorem

Under mild regularity conditions, the last term is independent of $\btheta$:

$$
\begin{aligned}
&\bbE_{q(\bx_{\sigma})}\big\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\big\|_2^2\\
&={\color{#8854c0}\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}}\big\|\bs_{\btheta,\sigma}(\bx_{\sigma})-{\color{teal}\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)}\big\|_2^2+\text{const}
\end{aligned}
$$

</div>
<div class="block" v-click="1">

## Gradient of the Noise Kernel

$$
\bx_{\sigma}=\bx+\sigma\cdot\bepsilon,\qquad q(\bx_{\sigma}|\bx)=\cN(\bx,\sigma^2\cdot\bI)
$$

<div v-click="2">

$$
\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)=-\frac{\bx_{\sigma}-\bx}{\sigma^2}=-\frac\bepsilon\sigma
$$

</div>
</div>
<div class="takeaway" v-click="3">

**Same minimizers, computable target:** train $\bs_{\btheta,\sigma}(\bx_{\sigma})$ against $-\bepsilon/\sigma$, which we know because we added the noise ourselves.

</div>


<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a></div>

---
clicks: 4
id: denoising-score-matching-3
class: theorems
---

# Denoising Score Matching: Before the Proof

<div class="block" style="margin: 10px 0;">

## 1. Start: Learn the Data Score

$$
\bbE_{\pd(\bx)}\left\|\bs_{\btheta}(\bx)-{\color{#8854c0}\nabla_\bx\log\pd(\bx)}\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>
<div class="block" v-click="1" style="margin: 10px 0;">

## 2. Perturb the Data: Learn the Smoothed Score

Target: the unknown score of the noisy-data marginal $q(\bx_{\sigma})$.

$$
\bbE_{q(\bx_{\sigma})}\left\|\bs_{\btheta,\sigma}(\bx_\sigma)-{\color{#8854c0}\nabla_{\bx_\sigma}\log q(\bx_{\sigma})}\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>
<div class="block" v-click="2" style="margin: 10px 0;">

## 3. Apply the Theorem: Same Minimizers, Known Target

$$
\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-{\color{teal}\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)}\right\|_2^2\rightarrow\min_{\btheta}
$$

<div v-click="3">

Sample $\bx_{\sigma}\sim q(\bx_{\sigma}|\bx)$ via $\bx_{\sigma}=\bx+\sigma\bepsilon$, $\bepsilon\sim\cN(0,\bI)$:

$$
\bbE_{\pd(\bx)}\bbE_{\bepsilon\sim\cN(0,\bI)}\left\|\bs_{\btheta,\sigma}(\bx+\sigma\cdot\bepsilon)-{\color{teal}\left(-\frac\bepsilon\sigma\right)}\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>
</div>
<div class="takeaway" v-click="4">

## After Training: Sample with the Learned Score

$$
\bx_{l+1}=\bx_l+\frac\eta2\cdot\bs_{\btheta,\sigma}(\bx_l)+\sqrt\eta\cdot\bepsilon_l,\qquad\bepsilon_l\sim\cN(0,\bI).
$$

</div>

<div class="source"><a href="https://yang-song.github.io/blog/2021/score/">Song Y. Generative Modeling by Estimating Gradients of the Data Distribution, blog post, 2021</a></div>

---
clicks: 4
id: denoising-score-matching-4
class: theorems
---

# Denoising Score Matching

<div class="block">

## Theorem

Under mild regularity conditions, the last term is independent of $\btheta$:

$$
\bbE_{q(\bx_{\sigma})}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\right\|_2^2
=\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)\right\|_2^2+\text{const}.
$$

</div>
<div class="block" v-click="1">

## Proof

For any integrable $h$, marginalize the joint distribution:

$$
\bbE_{q(\bx_{\sigma})}h(\bx_{\sigma})
=\int\left({\color{#8854c0}\int q(\bx_{\sigma}|\bx)\pd(\bx)d\bx}\right)h(\bx_{\sigma})d\bx_{\sigma}
=\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}h(\bx_{\sigma}).
$$

<div v-click="2">

Expand the squared error:

$$ {1|all} {at:3}
\begin{gathered}
\bbE_{q(\bx_{\sigma})}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\right\|_2^2\\
=\bbE_{q(\bx_{\sigma})}\|\bs_{\btheta,\sigma}(\bx_{\sigma})\|_2^2
+\underbrace{\bbE_{q(\bx_{\sigma})}\|\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\|_2^2}_{C_1}
-2{\color{teal}\bbE_{q(\bx_{\sigma})}\left[\bs_{\btheta,\sigma}^\top(\bx_{\sigma})\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\right]}.
\end{gathered}
$$

</div>
<div v-click="3">

The score-norm term $C_1$ is independent of $\btheta$.

</div>
</div>

<div class="takeaway" v-click="4">

**Next:** rewrite the last cross term $-2\bbE_{q(\bx_{\sigma})}\left[\bs_{\btheta,\sigma}^\top(\bx_{\sigma})\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\right]$ using the conditional score.

</div>

<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a></div>

<!-- Compact proof, part 1. Assume the displayed expectations are finite and differentiation/integration may be interchanged. Marginalization applies to any integrable h, including the model squared norm. -->

---
clicks: 5
id: denoising-score-matching-5
class: theorems
---

# Denoising Score Matching

<div class="block">

## Theorem

Under mild regularity conditions, the last term is independent of $\btheta$:

$$
\bbE_{q(\bx_{\sigma})}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\right\|_2^2
=\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)\right\|_2^2+\text{const}.
$$

</div>
<div class="block" v-click="1">

## Proof (Continued)

Use marginalization and $\nabla q=q\,\nabla\log q$ to rewrite the cross term:

$$ {1|1-2|all} {at:2}
\begin{gathered}
{\color{#8854c0}\bbE_{q(\bx_{\sigma})}}\left[\bs_{\btheta,\sigma}^\top(\bx_{\sigma}){\color{teal}\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})}\right]
=\int\bs_{\btheta,\sigma}^\top(\bx_{\sigma}){\color{teal}\nabla_{\bx_{\sigma}}q(\bx_{\sigma})}d\bx_{\sigma}\\
=\int\bs_{\btheta,\sigma}^\top(\bx_{\sigma})\nabla_{\bx_{\sigma}}\left({\color{#8854c0}\int q(\bx_{\sigma}|\bx)\pd(\bx)d\bx}\right)d\bx_{\sigma}
=\int\int\pd(\bx)\bs_{\btheta,\sigma}^\top(\bx_{\sigma}){\color{teal}\nabla_{\bx_{\sigma}}q(\bx_{\sigma}|\bx)}\,d\bx\,d\bx_{\sigma}\\
={\color{#8854c0}\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}}\left[\bs_{\btheta,\sigma}^\top(\bx_{\sigma}){\color{teal}\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)}\right].
\end{gathered}
$$

<div v-click="4">

Substitute and complete the square:

$$ {1|all} {at:5}
\begin{gathered}
\bbE_{q(\bx_{\sigma})}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma})\right\|_2^2
={\color{#8854c0}\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}}\left[\|\bs_{\btheta,\sigma}(\bx_{\sigma})\|_2^2-2\bs_{\btheta,\sigma}^\top(\bx_{\sigma}){\color{teal}\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)}\right]+{\color{olive}C_1}\\
={\color{#8854c0}\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-{\color{teal}\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)}\right\|_2^2+{\color{olive}\text{const}}.
\end{gathered}
$$

</div>
</div>

<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a></div>

<!-- Compact proof, part 2, incorporates source frame 24. The last mixed-term equality uses grad q = q grad log q and Fubini. const = C_1 - E_joint ||grad log q(x_sigma | x)||^2, independent of theta. The theorem remains visible on both slides. -->

---
clicks: 5
id: denoising-score-matching-6
class: theorems
---

# What Does Denoising Score Matching Learn?

**Why the theorem works:** MSE learns the average conditional target.

<div class="block">

$$
\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>
<div v-click="1">

The model sees only $\bx_\sigma$; the target also depends on $\bx$.<br>For each $\bx_\sigma$, the MSE-optimal prediction $\bs^*_\sigma(\bx_\sigma)$ is the average target:

$$
\bs^*_\sigma(\bx_\sigma)=\bbE_{q(\bx|\bx_\sigma)}\left[\nabla_{\bx_\sigma}\log q(\bx_\sigma|\bx)\right]
$$

</div>
<div class="block" v-click="2">

## From the Optimal Prediction to the Marginal Score

$$ {1|1-2|all} {at:3}
\begin{aligned}
\bs^*_\sigma(\bx_\sigma)&=\int\nabla_{\bx_\sigma}\log q(\bx_\sigma|\bx)\cdot{\color{#8854c0}\frac{q(\bx_\sigma|\bx)\pd(\bx)}{q(\bx_\sigma)}}d\bx\\
&=\frac{1}{q(\bx_\sigma)}\int\nabla_{\bx_\sigma}q(\bx_\sigma|\bx)\pd(\bx)d\bx\\
&=\frac{\nabla_{\bx_\sigma}{\color{#8854c0}\int q(\bx_\sigma|\bx)\pd(\bx)d\bx}}{q(\bx_\sigma)}=\nabla_{\bx_\sigma}\log q(\bx_\sigma).
\end{aligned}
$$

</div>
<div class="takeaway" v-click="5">

**Different conditional targets, one marginal score:** $\bs^*_\sigma(\bx_\sigma)=\nabla_{\bx_\sigma}\log q(\bx_\sigma)$.<br>
Variation around this average adds only a model-independent constant to the loss.

</div>


<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a></div>

<!--
Here s*_sigma denotes the MSE-optimal prediction over unrestricted functions, not an assertion that a finite neural network attains it. The trained network approximates this function. Read the derivation forward: expand the posterior average using Bayes, use q grad log q = grad q, then differentiate the marginal density under the integral.

Connection to the theorem: this identity becomes an alternative proof when combined with the MSE decomposition. Let T = grad_{x_sigma} log q(x_sigma | x), m(x_sigma) = E[T | x_sigma] = s*_sigma(x_sigma), and s = s_{theta,sigma}(x_sigma). Expectations below are over the joint p_data(x) q(x_sigma | x):

E ||s - T||^2 = E ||s - m||^2 + E ||T - m||^2.

The cross term vanishes because E[T - m | x_sigma] = 0. The left-hand side is DSM, the first term on the right is marginal score matching, and the remaining term is independent of theta. Thus L_SM = L_DSM + const with const = -E ||T - m||^2, exactly as in the theorem. This holds for any network, whether or not it can represent m exactly, under the same integrability and differentiation conditions.
-->

---
clicks: 3
id: tweedie-s-formula
class: theorems
---

# Tweedie's Formula: From Score to Predictions

For $\bx_\sigma=\bx+\sigma\bepsilon$, with independent $\bx\sim\pd$, $\bepsilon\sim\cN(0,\bI)$ and $\sigma>0$, the posterior-average identity gives:

$$
\nabla_{\bx_\sigma}\log q(\bx_\sigma)
=\bbE_{q(\bx|\bx_\sigma)}\left[\frac{\bx-\bx_\sigma}{\sigma^2}\right]
=\frac{\bbE_{q(\bx|\bx_\sigma)}[\bx]-\bx_\sigma}{\sigma^2}.
$$

<div class="block" v-click="1">

## Tweedie's Formula: Predict Clean Data

$$
\bbE_{q(\bx|\bx_\sigma)}[\bx]=\bx_\sigma+\sigma^2\nabla_{\bx_\sigma}\log q(\bx_\sigma).
$$

</div>
<div class="block" v-click="2">

## Predict the Added Noise

$$
\bbE[\bepsilon\mid\bx_\sigma]=-\sigma\nabla_{\bx_\sigma}\log q(\bx_\sigma).
$$

These are MSE-optimal conditional means, not necessarily the original $\bx$ and $\bepsilon$.

</div>
<div class="takeaway" v-click="3">

## Use the Trained Score Network

$$
\hat{\bx}=\bx_\sigma+\sigma^2\bs_{\btheta,\sigma}(\bx_\sigma),\qquad
\hat{\bepsilon}=-\sigma\bs_{\btheta,\sigma}(\bx_\sigma).
$$

**One score model predicts both clean data and noise**, approximating their conditional means.

</div>

<div class="source"><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3325056/">Efron B. Tweedie's Formula and Selection Bias, 2011</a></div>

<!-- Assume finite second moments. The identities use the true marginal score; replacing it by the trained score network gives approximate clean-data and noise predictions. The conditional means need not equal the particular clean sample or noise realization that produced the observation. -->

---
clicks: 3
id: from-conditional-scores-to-denoising
class: theorems interactive-slide
---

<script setup>
import TweedieDemo from './components/TweedieDemo.vue'
</script>

# From Conditional Scores to Denoising

Toy data: three equally likely clean points $\bx_i$, with $\bx_\sigma=\bx+\sigma\bepsilon$, $\bepsilon\sim\cN(0,\bI)$ and $\sigma=1$.

<TweedieDemo :stage="$clicks" />

<div class="source"><a href="http://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf">Vincent P. A Connection Between Score Matching and Denoising Autoencoders, 2010</a><br><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3325056/">Efron B. Tweedie's Formula and Selection Bias, 2011</a></div>

<!-- Original analytic toy example. The clean prior is uniform on three atoms; the Gaussian-corrupted marginal is smooth. At sigma = 1 the displayed conditional-score vectors end at the clean points, and the marginal-score vector ends at the posterior mean. Clicks: conditional scores → posterior weights → marginal score → Tweedie. The arrows are exact, not estimates from a trained model. Posterior weights follow Bayes: the equal prior masses 1/3 and Gaussian normalization constants cancel. The denoised estimate is the posterior-weighted mean of the clean points; its location between modes is a consequence of averaging. -->

---
clicks: 4
id: denoising-score-matching-7
class: theorems
---

# Denoising Score Matching: Method Overview

<div class="block" style="margin: 10px 0;">

## 1. Start: Learn the Data Score

$$
\bbE_{\pd(\bx)}\left\|\bs_{\btheta}(\bx)-{\color{#8854c0}\nabla_\bx\log\pd(\bx)}\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>
<div class="block" v-click="1" style="margin: 10px 0;">

## 2. Perturb the Data: Learn the Smoothed Score

Target: the unknown score of the noisy-data marginal $q(\bx_{\sigma})$.

$$
\bbE_{q(\bx_{\sigma})}\left\|\bs_{\btheta,\sigma}(\bx_\sigma)-{\color{#8854c0}\nabla_{\bx_\sigma}\log q(\bx_{\sigma})}\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>
<div class="block" v-click="2" style="margin: 10px 0;">

## 3. Apply the Theorem: Same Minimizers, Known Target

$$
\bbE_{\pd(\bx)}\bbE_{q(\bx_{\sigma}|\bx)}\left\|\bs_{\btheta,\sigma}(\bx_{\sigma})-{\color{teal}\nabla_{\bx_{\sigma}}\log q(\bx_{\sigma}|\bx)}\right\|_2^2\rightarrow\min_{\btheta}
$$

<div v-click="3">

Sample $\bx_{\sigma}\sim q(\bx_{\sigma}|\bx)$ via $\bx_{\sigma}=\bx+\sigma\bepsilon$, $\bepsilon\sim\cN(0,\bI)$:

$$
\bbE_{\pd(\bx)}\bbE_{\bepsilon\sim\cN(0,\bI)}\left\|\bs_{\btheta,\sigma}(\bx+\sigma\cdot\bepsilon)-{\color{teal}\left(-\frac\bepsilon\sigma\right)}\right\|_2^2\rightarrow\min_{\btheta}
$$

</div>
</div>
<div class="takeaway" v-click="4">

## After Training: Sample with the Learned Score

$$
\bx_{l+1}=\bx_l+\frac\eta2\cdot\bs_{\btheta,\sigma}(\bx_l)+\sqrt\eta\cdot\bepsilon_l,\qquad\bepsilon_l\sim\cN(0,\bI).
$$

</div>

<div class="source"><a href="https://yang-song.github.io/blog/2021/score/">Song Y. Generative Modeling by Estimating Gradients of the Data Distribution, blog post, 2021</a></div>

---
clicks: 0
id: outline-5
section: "Noise-Conditioned Score Network (NCSN)"
class:
---

# Outline

<div class="course-outline">
<div class="outline-item"><span>01</span><div>Langevin Dynamics</div></div>

<div class="outline-item current"><span>02</span><div>Score Matching<div class="outline-sub">Denoising Score Matching<br><b>Noise-Conditioned Score Network (NCSN)</b></div></div></div>
<div class="outline-item"><span>03</span><div>Forward Gaussian Diffusion Process</div></div>

</div>

---
clicks: 0
id: denoising-score-matching-8
class: theorems
---

# Denoising Score Matching

$$
\bbE_{\pd(\bx)}\bbE_{\cN(0,\bI)}\left\|\bs_{\btheta,\sigma}(\bx+\sigma\bepsilon)+\frac\bepsilon\sigma\right\|_2^2\rightarrow\min_{\btheta}
$$

<div class="columns balanced">
<div>

$$
\bx_{l+1}=\bx_l+\frac\eta2\cdot\bs_{\btheta,\sigma}(\bx_l)+\sqrt\eta\cdot\bepsilon_l
$$

- For **small** $\sigma$, $\bs_{\btheta,\sigma}(\bx)$ becomes inaccurate and Langevin dynamics fails to traverse modes.
- For **large** $\sigma$, robustness in low-density regions is achieved, but the model learns a distribution that is overly corrupted.

</div>
<div>
<img src="/figs/pitfalls.jpg" alt="Inaccurate scores in low-density regions" style="height: 215px; width: 100%; object-fit: contain;" />
<img src="/figs/single_noise.jpg" alt="Score estimation at a single noise level" style="height: 180px; width: 100%; object-fit: contain;" />
</div>
</div>


<div class="source"><a href="https://yang-song.github.io/blog/2021/score/">Song Y. Generative Modeling by Estimating Gradients of the Data Distribution, blog post, 2021</a></div>

---
clicks: 1
id: noise-conditioned-score-network-ncsn
class: theorems
---

# Noise-Conditioned Score Network (NCSN)

- Specify a sequence of noise levels: $\sigma_1<\sigma_2<\dots<\sigma_T$.
- Perturb each data point with different noise levels: $\bx_t=\bx+\sigma_t\bepsilon$, so $\bx_t\sim q(\bx_t)$.
- Choose $\sigma_1,\sigma_T$ such that:

$$
q(\bx_1)\approx\pd(\bx),\qquad q(\bx_T)\approx\cN(0,\sigma_T^2\bI)
$$

<div v-click="1">
<img src="/figs/multi_scale.jpg" alt="Density at multiple noise scales" style="height: 145px; width: 100%; object-fit: contain;" />
<img src="/figs/duoduo.jpg" alt="Images corrupted with increasing Gaussian noise" style="height: 175px; width: 100%; object-fit: contain;" />
</div>


<div class="source"><a href="https://arxiv.org/abs/1907.05600">Song Y. et al. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a></div>

---
clicks: 3
id: noise-conditioned-score-network-ncsn-2
class: theorems
---

# Noise-Conditioned Score Network (NCSN)

Train the denoising score function $\bs_{\btheta,\sigma_t}(\bx_t)$ for each noise level $\sigma_t$ using a unified weighted objective:

$$
\sum_{t=1}^T{\color{#8854c0}\sigma_t^2}\bbE_{\pd(\bx)}\bbE_{q(\bx_t|\bx)}\left\|\bs_{\btheta,\sigma_t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx)\right\|_2^2\rightarrow\min_{\btheta}
$$

<div v-click="1">

The target is $-\bepsilon/\sigma_t$. The weight $\sigma_t^2$ compensates its scale:

$$
\sigma_t^2\left\|\bs_{\btheta,\sigma_t}(\bx_t)+\frac{\bepsilon}{\sigma_t}\right\|^2
=\left\|-\sigma_t\bs_{\btheta,\sigma_t}(\bx_t)-\bepsilon\right\|^2.
$$

</div>
<div class="block" v-click="2">

## Training

1. Sample $\bx_0\sim\pd(\bx)$, $t\sim U\{1,T\}$, $\bepsilon\sim\cN(0,\bI)$.
2. Compute noisy image $\bx_t=\bx_0+\sigma_t\bepsilon$.
3. Compute loss $\cL=\sigma_t^2\left\|\bs_{\btheta,\sigma_t}(\bx_t)+\frac\bepsilon{\sigma_t}\right\|^2$.
4. Update $\btheta$ via stochastic gradient descent.

</div>
<div v-click="3">

How do we sample from such a model?

</div>


<div class="source"><a href="https://arxiv.org/abs/1907.05600">Song Y. et al. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a></div>

---
clicks: 2
id: noise-conditioned-score-network-ncsn-3
class: theorems
---

# Noise-Conditioned Score Network (NCSN)

**Inner loop ($l$):** run Langevin dynamics at fixed $\sigma_t$, targeting $q(\bx_t)$.<br>
**Outer loop ($t=T,\dots,1$):** lower the noise and reuse samples at the next level.

<div class="block" v-click="1">

## Sampling (Annealed Langevin Dynamics)

1. Sample $\bx_T^0\sim\cN(0,\sigma_T^2\bI)\approx q(\bx_T)$.
2. Update $\bx_t^l$ via $L$ steps of Langevin dynamics at each noise level $\sigma_t$:

   $$
   \bx_t^l=\bx_t^{l-1}+\frac{\eta_t}2\bs_{\btheta,\sigma_t}(\bx_t^{l-1})+\sqrt{\eta_t}\bepsilon_t^l.
   $$

3. Update $\bx_{t-1}^0:=\bx_t^L$ and proceed to $\sigma_{t-1}$ if $t>1$.

</div>
<div class="columns balanced" v-click="2">
<div>

## Why Gradually?

High noise helps explore different modes; lower noise restores detail. Nearby noise levels let us reuse samples instead of restarting.

</div>
<div>
<img src="/figs/ald.png" alt="Annealed Langevin dynamics across decreasing noise levels" style="height: 180px; width: 100%; object-fit: contain;" />
</div>
</div>


<div class="source"><a href="https://arxiv.org/abs/2006.09011">Song Y. et al. Improved Techniques for Training Score-Based Generative Models, 2020</a></div>

---
clicks: 0
id: outline-6
section: "Forward Gaussian Diffusion Process"
---

# Outline

<div class="course-outline">
<div class="outline-item"><span>01</span><div>Langevin Dynamics</div></div>

<div class="outline-item"><span>02</span><div>Score Matching<div class="outline-sub">Denoising Score Matching<br>Noise-Conditioned Score Network (NCSN)</div></div></div>
<div class="outline-item current"><span>03</span><div>Forward Gaussian Diffusion Process</div></div>

</div>

---
clicks: 0
id: generative-models-taxonomy-2
---

# Generative Models Taxonomy

<TaxonomyDiagram class="taxonomy" denoising-diffusion alt="Generative models taxonomy with DDPM highlighted" />

---
clicks: 4
id: forward-gaussian-diffusion-process
class: theorems
---

# Forward Gaussian Diffusion Process

Let $\bx_0=\bx\sim\pd(\bx)$, $\beta_t\ll1$. Define a Markov chain:

$$
\bx_t=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t,\quad\bepsilon_t\sim\cN(0,\bI)
$$

<div v-click="1">

$$
q(\bx_t|\bx_{t-1})=\cN(\sqrt{1-\beta_t}\bx_{t-1},\beta_t\bI)
$$

</div>
<div class="block" v-click="2">

## Langevin Dynamics

$$
\bx_{l+1}=\bx_l+\frac{\color{#8854c0}\eta}{2}\cdot{\color{teal}\nabla_{\bx_l}\log\pt(\bx_l)}+\sqrt{\color{#8854c0}\eta}\bepsilon_l,\quad\bepsilon_l\sim\cN(0,\bI)
$$

</div>

<div v-click="3">

$$
\begin{aligned}
\bx_t&=\sqrt{1-\beta_t}\,\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t\\
&\approx\left(1-\frac{\beta_t}{2}\right)\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t\\
&=\bx_{t-1}+\frac{\color{#8854c0}\beta_t}{2}{\color{teal}(-\bx_{t-1})}+\sqrt{\color{#8854c0}\beta_t}\bepsilon_t
\end{aligned}
$$

</div>
<div class="takeaway" v-click="4">

**From a Markov chain to Langevin dynamics:** for small $\beta_t$, this Gaussian chain approximates LD targeting $\cN(0,\bI)$, with step size ${\color{#8854c0}\eta=\beta_t}$ and Gaussian score ${\color{teal}-\bx_{t-1}}$.

</div>

<div class="source"><a href="http://proceedings.mlr.press/v37/sohl-dickstein15.pdf">Sohl-Dickstein J. Deep Unsupervised Learning using Nonequilibrium Thermodynamics, 2015</a></div>

---
clicks: 5
id: forward-gaussian-diffusion-process-2
class: theorems
---

# Forward Diffusion: Sample at Any Timestep

Fix a schedule $0<\beta_t<1$. The noises $\bepsilon_t\sim\cN(0,\bI)$ are independent across $t$ and of $\bx_0$.

$$
\bx_t=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t.
$$

<div class="block" v-click="1">

## Exact Conditional Distribution

Let $\alpha_t=1-\beta_t$ and $\bar{\alpha}_t=\prod_{s=1}^t\alpha_s$. Then

$$
q(\bx_t|\bx_0)=\cN(\sqrt{\bar{\alpha}_t}\,\bx_0,(1-\bar{\alpha}_t)\bI).
$$

<div v-click="2">

Sample $\bx_t$ directly from $\bx_0$, without simulating the intermediate steps:

$$ {1|1-2|1-3|all} {at:3}
\begin{aligned}
\bx_t&=\sqrt{\alpha_t}\bx_{t-1}+\sqrt{1-\alpha_t}\bepsilon_t\\
&=\sqrt{\alpha_t\alpha_{t-1}}\bx_{t-2}+({\color{#8854c0}\sqrt{\alpha_t(1-\alpha_{t-1})}\bepsilon_{t-1}+\sqrt{1-\alpha_t}\bepsilon_t})\\
&=\sqrt{\alpha_t\alpha_{t-1}}\bx_{t-2}+{\color{#8854c0}\sqrt{1-\alpha_t\alpha_{t-1}}\bepsilon'_t}\\
&=\ldots={\color{teal}\sqrt{\bar{\alpha}_t}\,\bx_0}+{\color{#8854c0}\sqrt{1-\bar{\alpha}_t}\bepsilon},\quad\bepsilon\sim\cN(0,\bI).
\end{aligned}
$$

</div>
</div>

<div class="source"><a href="http://proceedings.mlr.press/v37/sohl-dickstein15.pdf">Sohl-Dickstein J. Deep Unsupervised Learning using Nonequilibrium Thermodynamics, 2015</a></div>

<!-- This finite-time identity is exact for any fixed schedule 0 < beta_t < 1; neither monotonicity nor beta_t << 1 is needed. Small beta was used only for the previous Langevin approximation. The first expansion is for t >= 2; t = 1 is the defining step. Independent Gaussian increments combine with variance alpha_t(1-alpha_{t-1}) + (1-alpha_t) = 1-alpha_t alpha_{t-1}. The aggregate epsilon is independent of x_0 for each fixed t; the direct representation does not prescribe a joint coupling across timesteps. -->

---
clicks: 3
id: forward-gaussian-diffusion-process-4
class: theorems
---

# When Does Only Gaussian Noise Remain?

The closed-form conditional already tells us how the signal disappears:

$$
\bx_t={\color{teal}\sqrt{\bar{\alpha}_t}\,\bx_0}+{\color{#8854c0}\sqrt{1-\bar{\alpha}_t}\bepsilon},\qquad\bepsilon\sim\cN(0,\bI),\quad\bepsilon\perp\bx_0.
$$

<div class="block" v-click="1">

## The Schedule Must Remove the Signal

For $0<\beta_t<1$, the required condition is

$$
\bar{\alpha}_t=\prod_{s=1}^t(1-\beta_s)\longrightarrow0
\quad\Longleftrightarrow\quad
\sum_{t=1}^{\infty}\beta_t=\infty.
$$

Many steps alone are not enough: $\beta_t=2^{-t}$ leaves $\bar{\alpha}_\infty>0$.

</div>
<div v-click="2">

$$
{\color{teal}\sqrt{\bar{\alpha}_t}\to0},\qquad
{\color{#8854c0}\sqrt{1-\bar{\alpha}_t}\to1}
\quad\Longrightarrow\quad
\bx_t\xrightarrow{d}\cN(0,\bI).
$$

The limit no longer depends on the initial data distribution $\pd$.

</div>
<div class="takeaway" v-click="3">

**For finite $T$:** choose $\bar{\alpha}_T\ll1$ with negligible residual signal $\sqrt{\bar{\alpha}_T}\bx_0$.<br>
Then $q(\bx_T)\approx\cN(0,\bI)$: the terminal distribution is approximately standard Gaussian.

</div>

<div class="source"><a href="https://arxiv.org/abs/2403.18103">Chan S. Tutorial on Diffusion Models for Imaging and Vision, 2024</a></div>

<!-- This is a direct consequence of the previous exact conditional, not a separate stationarity theorem. For a fixed schedule 0 < beta_t < 1, alpha_bar_t -> 0 iff sum beta_t diverges. If sum beta_t converges, beta_t -> 0 and the tail sum of -log(1-beta_t) converges; finitely many initial factors are positive. If the sum diverges, log(1-beta_t) <= -beta_t forces the product to zero. Under alpha_bar_t -> 0, the marginal converges in distribution for any probability law on finite-dimensional x_0, without a moment assumption. Couple the one-time representations using an independent Gaussian epsilon to see the limit. For finite T, closeness depends on the data scale as well as alpha_bar_T. -->

---
clicks: 0
id: forward-gaussian-diffusion-process-3
class: theorems interactive-slide
---

<script setup>
import ForwardDiffusionDemo from './components/ForwardDiffusionDemo.vue'
</script>

# Forward Diffusion: From Data to Noise

$$
\begin{aligned}
q(\bx_t|\bx_{t-1})&=\cN\left(\sqrt{1-\beta_t}\bx_{t-1},\beta_t\bI\right);\\
q(\bx_t|\bx_0)&=\cN\left({\color{teal}\sqrt{\bar{\alpha}_t}\bx_0},{\color{#8854c0}(1-\bar{\alpha}_t)\bI}\right)
\end{aligned}
$$

<ForwardDiffusionDemo />

<div class="source"><a href="https://arxiv.org/abs/2403.18103">Chan S. Tutorial on Diffusion Models for Imaging and Vision, 2024</a></div>

<!-- Original analytic 1D illustration replacing the source image. The plots show marginals, not conditional kernels or a sample trajectory. Each initial Gaussian component has mean scaled by sqrt(alpha_bar_t) and variance alpha_bar_t * 0.35^2 + 1 - alpha_bar_t. beta_t = 0.01; the PDF compares t = 0, 75, 250, 1000. -->

---
clicks: 2
id: forward-gaussian-diffusion-process-5
class: theorems
---

# Forward Gaussian Diffusion Process

**Diffusion** describes the migration of particles from regions of high density to those of low density.

<div class="columns balanced">
<img src="/figs/diffusion_over_time.png" alt="Diffusion over time" style="width:100%;height:340px;object-fit:contain" />
<div v-click="1">

1. $\bx_0=\bx\sim\pd(\bx)$
2. $\bx_t=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t$,<br>$\bepsilon_t\sim\cN(0,\bI)$, $t\geq1$
3. Choose $\bar{\alpha}_T\ll1$ to suppress $\sqrt{\bar{\alpha}_T}\bx_0$.<br>Then $q(\bx_T)\approx\cN(0,\bI)$.

</div>
</div>
<div v-click="2">

If this process can be reversed, we can sample from $\pd(\bx)$ by starting from noise $\cN(0,\bI)\approx q(\bx_T)$.<br>
Our goal now becomes inverting this diffusion.

</div>

<div class="source"><a href="https://ayandas.me/blog-tut/2021/12/04/diffusion-prob-models.html">Das A. An Introduction to Diffusion Probabilistic Models, blog post, 2021</a></div>

---
clicks: 3
id: denoising-score-matching-9
class: theorems
---

# Denoising Score Matching

<div class="block">

## NCSN

$$
\begin{aligned}
q(\bx_t|\bx_0)&=\cN(\bx_0,\sigma_t^2\bI),\quad q(\bx_1)\approx\pd(\bx),\quad q(\bx_T)\approx\cN(0,\sigma_T^2\bI)\\
\nabla_{\bx_t}\log q(\bx_t|\bx)&=-\frac{\bx_t-\bx}{\sigma_t^2}
\end{aligned}
$$

</div>
<div class="block" v-click="1">

## Gaussian Diffusion

$$
\begin{aligned}
q(\bx_t|\bx_0)&=\cN(\sqrt{\bar{\alpha}_t}\bx_0,(1-\bar{\alpha}_t)\bI),\quad q(\bx_1)\approx\pd(\bx),\quad q(\bx_T)\approx\cN(0,\bI)\\
\nabla_{\bx_t}\log q(\bx_t|\bx_0)&=-\frac{\bx_t-\sqrt{\bar{\alpha}_t}\bx_0}{1-\bar{\alpha}_t}
\end{aligned}
$$

</div>

<div class="block" v-click="2">

## Theorem (Denoising Score Matching)

$$
\begin{aligned}
&\bbE_{q(\bx_t)}\left\|\bs_{\btheta,t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t)\right\|_2^2\\
&\quad=\bbE_{\pd(\bx)}\bbE_{q(\bx_t|\bx)}\left\|\bs_{\btheta,t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx)\right\|_2^2+\text{const}
\end{aligned}
$$

</div>
<div v-click="3">

**Note:** Annealed Langevin dynamics applies to diffusion, too.

NCSN with annealed Langevin dynamics is an early score-based generative framework (2019–2020).

</div>

<div class="source"><a href="https://arxiv.org/abs/1907.05600">Song Y. et al. Generative Modeling by Estimating Gradients of the Data Distribution, 2019</a></div>

---
clicks: 0
id: summary
class: summary
---

# Summary

- Langevin dynamics combines log-density gradients and Gaussian noise to sample approximately from an unnormalized model.

- Score matching minimizes Fisher divergence to estimate the score function.
- Denoising score matching makes the score objective estimable using corrupted samples and the known corruption kernel.
- Tweedie's formula converts the score into MSE-optimal clean-data and noise predictions.
- Noise-Conditioned Score Networks balance score losses with weights $\sigma_t^2$ and sample with annealed Langevin dynamics.
- The forward Gaussian diffusion process admits a closed-form conditional distribution for any timestep.
- With a suitable noise schedule, the forward process converges to standard Gaussian noise; denoising score matching also applies to these diffusion marginals.
