---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 5"
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
omittedSourceFrames: [2, 10, 11, 12, 14]
importedSourceFrames: {"6": [13, 14]}
clicks: 0
sourceFrame: "1"
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 5</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "3"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Theorem

$$
\frac1n\sum_{i=1}^n\KL(q_{\bphi}(\bz|\bx_i)\,\|\,p(\bz))=\KL({\color{teal}\qagg(\bz)}\,\|\,p(\bz))+\bbI_q[\bx,\bz].
$$

</div>

<div class="block">

## Revisiting the ELBO

$$
\begin{aligned}
\frac1n\sum_{i=1}^n\cL_{\bphi,\btheta}(\bx_i)
&=\underbrace{\frac1n\sum_{i=1}^n\bbE_{q_{\bphi}(\bz|\bx_i)}\log\pt(\bx_i|\bz)}_{\text{Reconstruction Loss}}\\
&\quad-\underbrace{\bbI_q[\bx,\bz]}_{\text{Mutual Information}}
-\underbrace{\KL({\color{teal}\qagg(\bz)}\,\|\,{\color{#8854c0}p(\bz)})}_{\text{Marginal KL}}.
\end{aligned}
$$

</div>

<div class="block">

## Optimal VAE Prior

$$
\KL(\qagg(\bz)\,\|\,p(\bz))=0\ \Leftrightarrow\ p(\bz)=\qagg(\bz)=\frac1n\sum_{i=1}^nq_{\bphi}(\bz|\bx_i).
$$

Thus, the optimal prior distribution $p(\bz)$ is the aggregated variational posterior $\qagg(\bz)$.

</div>



<div class="source"><a href="http://approximateinference.org/accepted/HoffmanJohnson2016.pdf">Hoffman M. D., Johnson M. J. ELBO Surgery: Yet Another Way to Carve Up the Variational Evidence Lower Bound, 2016</a></div>

---
clicks: 0
sourceFrame: "4"
class: theorems
---

# Recap of Previous Lecture

- **Prior mismatch:** The unimodal encoder $q_{\bphi}(\bz|\bx)$ yields $\qagg(\bz)$ that often does not match the Gaussian prior $p(\bz)$.
- **Blurriness from averaging:** With a fixed encoder, prior and Gaussian decoder variance, ELBO maximization gives $\bmu^*(\bz)=\bbE_{q_{\bphi}(\bx|\bz)}[\bx]$. If distinct inputs $\bx\neq\bx'$ map to *overlapping* latent regions, the decoder averages over unrelated data.
<img src="/figs/agg_posterior.png" alt="agg posterior" style="width: 100%; height: 240px; object-fit: contain; margin: 0 auto;" />



<div class="source"><a href="https://arxiv.org/abs/1505.05770">Rezende D. J., Mohamed S. Variational Inference with Normalizing Flows, 2015</a></div>

---
clicks: 0
sourceFrame: "5"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Assumptions

- Let $c\sim\Cat(\bpi)$, where

$$
\bpi=(\pi_1,\dots,\pi_K),\quad\pi_k=P(c=k),\quad\sum_{k=1}^K\pi_k=1.
$$

- For tokenizer training, fix $p(c)=\Uniform\{1,\dots,K\}$.

</div>

<div class="block">

## ELBO

$$
\cL_{\bphi,\btheta}(\bx)=\bbE_{q_{\bphi}(c|\bx)}\log\pt(\bx|c)-{\color{olive}\KL(q_{\bphi}(c|\bx)\,\|\,p(c))}\rightarrow\max_{\bphi,\btheta}.
$$



$$
\KL(q_{\bphi}(c|\bx)\,\|\,p(c))=-\Ent(q_{\bphi}(c|\bx))+\log K.
$$

</div>

<div class="block">

## Quantized Representation

Define the codebook (dictionary) space $\{\be_k\}_{k=1}^K$ with $\be_k\in\bbR^L$ and $K$ the number of codebook entries.

$$
\bz_q=\bq(\bz)=\be_{k^*},\quad\text{where }k^*=\argmin_k\|\bz-\be_k\|.
$$

</div>



<div class="source"><a href="https://arxiv.org/abs/1711.00937">Oord A., Vinyals O., Kavukcuoglu K. Neural Discrete Representation Learning, 2017</a></div>

---
clicks: 0
sourceFrame: "6"
class: theorems
---

# Recap of Previous Lecture

<img src="/figs/vqvae.png" alt="vqvae" style="width: 100%; height: 135px; object-fit: contain; margin: 0 auto;" />

<div class="block">

## Deterministic Variational Posterior

$$
q_{\bphi}(c=k^*|\bx)=\begin{cases}
1,&\text{for }k^*=\argmin_k\|\bz_e-\be_k\|;\\
0,&\text{otherwise.}
\end{cases}
$$

</div>

<div class="block">

## ELBO

$$
\cL_{\bphi,\btheta}(\bx)=\bbE_{q_{\bphi}(c|\bx)}\log\pt(\bx|\be_c)-\log K=\log\pt(\bx|\bz_q)-\log K.
$$

</div>

<div class="block">

## Straight-Through Gradient Estimator

$$
\frac{\partial\log p(\bx|\bz_q,\btheta)}{\partial\bphi}=\frac{\partial\log\pt(\bx|\bz_q)}{\partial\bz_q}\cdot{\color{red}\frac{\partial\bz_q}{\partial\bphi}}\approx\frac{\partial\log\pt(\bx|\bz_q)}{\partial\bz_q}\cdot\frac{\partial\bz_e}{\partial\bphi}
$$

</div>



<div class="source"><a href="https://arxiv.org/abs/1711.00937">Oord A., Vinyals O., Kavukcuoglu K. Neural Discrete Representation Learning, 2017</a></div>

---
clicks: 0
sourceFrame: "7"
class: theorems
---

# Recap of Previous Lecture

<div class="block" style="margin: 12px 0;">

## Likelihood-Free Learning

- Likelihood isn't always a suitable metric for evaluating generative models.
- Sometimes, the likelihood function can't even be computed exactly.

</div>


Imagine we have two sets of samples:

- $\{\bx_i\}_{i=1}^{n_1}\sim\pd(\bx)$ — real samples;
- $\{\bx_i\}_{i=1}^{n_2}\sim\pt(\bx)$ — generated (fake) samples.


$$
p(y=1|\bx)=P(\bx\sim\pd(\bx));\quad p(y=0|\bx)=P(\bx\sim\pt(\bx))
$$

<div class="block" style="margin: 12px 0;">

## Assumption

The generative model $\pt(\bx)$ matches $\pd(\bx)$ if a discriminative model $p(y|\bx)$ can't distinguish between them — that is, if $p(y=1|\bx)=0.5$ for every $\bx$.

</div>


- **Generator:** a generative model $\bx=\bG_{\btheta}(\bz)$ that produces more realistic samples.
- **Discriminator:** a classifier $D_{\bphi}(\bx)\in[0,1]$ distinguishing real from generated samples.

---
clicks: 3
sourceFrame: "8"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Cross-Entropy for Discriminative Model

$$
\max_{p(y|\bx)}\left[\bbE_{\pd(\bx)}\log p(y=1|\bx)+\bbE_{\pt(\bx)}\log p(y=0|\bx)\right]
$$

</div>

<div v-click="1">

- **Discriminator:** A classifier $p_{\bphi}(y=1|\bx)=D_{\bphi}(\bx)\in[0,1]$, distinguishing real and generated samples. The discriminator aims to **maximize** cross-entropy.
- **Generator:** The generative model $\bx=\bG_{\btheta}(\bz),\;\bz\sim p(\bz)$, seeks to fool the discriminator. The generator aims to **minimize** cross-entropy.

</div>

<div class="block" v-click="2">

## GAN Objective

$$
\min_G\max_D\left[\bbE_{\pd(\bx)}\log D(\bx)+\bbE_{\pt(\bx)}\log(1-D(\bx))\right]
$$

<div v-click="3">

$$
\min_G\max_D\left[\bbE_{\pd(\bx)}\log D(\bx)+\bbE_{p(\bz)}\log(1-D(\bG(\bz)))\right]
$$

</div>

</div>



<div class="source"><a href="https://arxiv.org/abs/1406.2661">Goodfellow I. J. et al. Generative Adversarial Networks, 2014</a></div>

---
clicks: 1
sourceFrame: "13"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Theorem

The following minimax game

$$
\min_G\max_D\Bigl[\bbE_{\pd(\bx)}\log D(\bx)+\bbE_{p(\bz)}\log(1-D(\bG(\bz)))\Bigr]
$$

achieves its global optimum precisely when $\pd(\bx)=\pt(\bx)$, and $D^*(\bx)=0.5$.

</div>

<div class="block">

## Expectations

If the generator can express **any** function and the discriminator is **optimal** at every step, the generator **will converge** to the target distribution.

</div>

<div class="block" v-click="1">

## Reality

- Generator updates are performed in parameter space, and the discriminator is often imperfectly optimized.
- Generator and discriminator losses typically oscillate during GAN training.

</div>



<div class="source"><a href="https://arxiv.org/abs/1406.2661">Goodfellow I. J. et al. Generative Adversarial Networks, 2014</a></div>

---
clicks: 0
sourceFrame: "9"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · Precision-Recall · CLIP Score · Human Eval</div></div></div>
<div class="outline-item"><span>05</span><div>Langevin Dynamics</div></div>

</div>

---
clicks: 0
sourceFrame: "auto: Generative Adversarial Networks (GAN)"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item current"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · Precision-Recall · CLIP Score · Human Eval</div></div></div>
<div class="outline-item"><span>05</span><div>Langevin Dynamics</div></div>

</div>

---
clicks: 1
sourceFrame: "15"
class: theorems
---

# Mode Collapse

Mode collapse refers to the phenomenon where the generator in a GAN produces only one or a few different modes of the distribution.

<img src="/figs/mode_collapse_1.png" alt="mode collapse 1" style="width: 100%; height: 150px; object-fit: contain; margin: 0 auto;" />

<img src="/figs/mode_collapse_4.png" alt="mode collapse 4" style="width: 100%; height: 180px; object-fit: contain; margin: 0 auto;" />

<div v-click="1">

Numerous methods have been proposed to tackle mode collapse: changing architectures, adding regularization terms, injecting noise.

</div>



<div class="source"><a href="https://arxiv.org/abs/1406.2661">Goodfellow I. J. et al. Generative Adversarial Networks, 2014</a><br><a href="https://arxiv.org/abs/1611.02163">Metz L. et al. Unrolled Generative Adversarial Networks, 2016</a></div>

---
clicks: 1
sourceFrame: "16"
class: theorems
---

# Jensen-Shannon vs Kullback-Leibler Divergences

- $\pd(\bx)$ is a fixed mixture of two Gaussians.
- $p(\bx|\mu,\sigma)=\cN(\mu,\sigma^2)$.
<div class="block">

## Mode Covering vs. Mode Seeking

$$
\KL(\pi\,\|\,p)=\int\pi(\bx)\log\frac{\pi(\bx)}{p(\bx)}d\bx,\quad\KL(p\|\pi)=\int p(\bx)\log\frac{p(\bx)}{\pi(\bx)}d\bx
$$



$$
\JSD(\pi\,\|\,p)=\frac12\Bigl[\KL\Bigl(\pi(\bx)\,\|\,\frac{\pi(\bx)+p(\bx)}2\Bigr)+\KL\Bigl(p(\bx)\,\|\,\frac{\pi(\bx)+p(\bx)}2\Bigr)\Bigr]
$$

<img src="/figs/JSD.png" alt="JSD" style="width: 100%; height: 225px; object-fit: contain; margin: 0 auto;" v-click="1" />

</div>



<!-- The original JSD illustration is retained. The forward/reverse KL illustrations are replaced by the approved interactive example on the continuation slide; reverse-KL fitting is not GAN training. -->

---
clicks: 0
sourceFrame: "extension: 16"
class: interactive-slide
---

# Mode Covering vs. Mode Seeking

$$
\pd(x)=\tfrac12\cN(x\mid-2,0.55^2)+\tfrac12\cN(x\mid2,0.55^2),\qquad\pt(x)=\cN(x\mid\mu,\sigma^2).
$$

<KLDemo />

<!-- Ask where one Gaussian should go. Move its mean and width, then fit forward KL and the two symmetric reverse-KL minima. Forward fitting matches mean and variance; reverse fitting uses numerical minimization. These are properties of this example and restricted family, not universal laws for all models. Reverse-KL minimization is not GAN training; the original JSD illustration remains on the preceding slide. About one to two minutes. The component is reused from the author-approved deferred Lecture 1 demonstration. -->

---
clicks: 1
sourceFrame: "extension: 8"
class: theorems
---

# From VQ-VAE to VQGAN

Same **encoder → quantization → decoder**; a new reconstruction objective.

<figure style="width: 720px; margin: 16px auto 12px">
<img src="/figs/vqgan_reconstructions.jpg" alt="Original paper comparison: input squirrel image, DALL-E discrete VAE reconstruction, and VQGAN reconstruction. Both models use spatial downsampling factor 8 and 8192 codes. VQGAN preserves more realistic fur and stone textures." style="display: block; width: 720px; height: 240px; object-fit: cover; object-position: left top;" />
<figcaption style="margin-top: 8px; text-align: center">

Same spatial downsampling $f=8$ and codebook size $K=8192$.

</figcaption>
</figure>

<div class="columns" v-click="1" style="grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 16px">
<div class="block" style="margin: 0">

## Perceptual Loss

A **fixed pretrained network** $F$ extracts features:

$$
\cL_{\text{perc}}=\|F(\bx)-F(\hat{\bx})\|_2^2.
$$

</div>
<div class="block" style="margin: 0">

## Adversarial Loss

Train discriminator $D$ to separate real and reconstructed **image patches**.

Train the autoencoder to **fool $D$**.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2012.09841">Esser P., Rombach R., Ommer B. Taming Transformers for High-Resolution Image Synthesis, 2021. Figure 12.</a></div>

<!--
The displayed viewport selects the first three columns of the original Figure 12
(input, DALL-E discrete VAE, VQGAN f8/8192); the source JPEG is unchanged.
This compares complete models, not an ablation isolating adversarial loss.
Both codebook and commitment terms remain; perceptual and adversarial objectives
change how reconstruction quality is learned. Perceptual loss compares features
of a pretrained network. The patch discriminator learns from real/reconstructed
images and is needed only during autoencoder training. More realistic textures do
not guarantee pixelwise fidelity: refer back to the conditional-mean discussion.
The feature-distance formula is a schematic perceptual objective; the paper uses
LPIPS with normalized multilayer features and learned weights. F stays frozen
during autoencoder training; gradients still pass through F to the reconstruction.
Unlike F, D is updated during training. The next slide separately introduces the
learned prior used for generation. Moved from Lecture 4 slide 42 by author request.
-->

---
clicks: 2
sourceFrame: "extension: 6"
class: theorems
---

# Generative Modeling in Latent Space

First learn a compact representation; then learn to **generate its latent codes**.

<div class="columns" style="grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 24px">
<div class="block" style="margin: 0">

## Discrete: VQGAN

Quantization gives a map of code indices.

$$
\bc\in\{1,\dots,K\}^{W\times H}
$$

<div v-click="1" style="margin-top: 28px">

**Autoregressive prior** over the code map.

$$
\bc\sim p_{\bpsi}(\bc)\;\longrightarrow\;\bz_q(\bc)\;\longrightarrow\;\hat{\bx}
$$

Sample codes → lookup → decode.

</div>
</div>
<div class="block" style="margin: 0">

## Continuous: KL-Autoencoder

Perceptual + adversarial losses; weak KL.

$$
\bz\in\bbR^{W\times H\times L}
$$

<div v-click="1" style="margin-top: 28px">

**Diffusion prior** in the learned latent space.

$$
\bepsilon\sim\cN(\bzero,\bI)\;\longrightarrow\;\bz\sim p_{\bpsi}(\bz)\;\longrightarrow\;\hat{\bx}
$$

Denoise in latent space → decode.

</div>
</div>
</div>

<div class="takeaway" v-click="2" style="margin-top: 32px">

Both recipes freeze the autoencoder before learning a prior that models its **aggregated posterior**.

</div>

<div class="source"><a href="https://arxiv.org/abs/2012.09841">Esser P. et al. Taming Transformers for High-Resolution Image Synthesis, 2021.</a><br /><a href="https://arxiv.org/abs/2112.10752">Rombach R. et al. High-Resolution Image Synthesis with Latent Diffusion Models, 2022.</a></div>

<!--
The continuous example is a KL-regularized autoencoder (the KL-reg
variant of LDM); the paper also studies VQ-reg. The two columns are examples, not
an exhaustive discrete/continuous taxonomy or a restriction on prior families.
Both autoencoders use perceptual/adversarial reconstruction objectives. Weak KL
encourages proximity to a Gaussian but does not guarantee an exactly Gaussian
aggregated posterior. The second stage learns the distribution of frozen codes;
it is not forced by discretization or by a constant KL in the continuous case.
The diffusion arrow denotes a future multi-step sampling algorithm, not a single
deterministic layer. No diffusion objective or denoising schedule is introduced.
Unlike the jointly trained GenFirst example in Lecture 4, these are two-stage recipes.
Moved from Lecture 4 slide 43 by author request; visible content is unchanged.
The decoder is deterministic here; z_q(c) includes codebook lookup.
-->

---
clicks: 0
sourceFrame: "auto: Wasserstein Distance"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item current"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · Precision-Recall · CLIP Score · Human Eval</div></div></div>
<div class="outline-item"><span>05</span><div>Langevin Dynamics</div></div>

</div>

---
clicks: 3
sourceFrame: "17"
class: theorems
---

# Theoretical Results

- The dimensionality of $\bz$ is less than that of $\bx$, so $\pt(\bx)$ with $\bx=\bG_{\btheta}(\bz)$ lives on a low-dimensional manifold.
<div v-click="1">

- The true data distribution $\pd(\bx)$ is also supported on a low-dimensional manifold.

<img src="/figs/low_dim_manifold.png" alt="low dim manifold" style="width: 100%; height: 205px; object-fit: contain; margin: 0 auto;" />

</div>

<div v-click="2">

- If $\pd(\bx)$ and $\pt(\bx)$ are disjoint, a smooth optimal discriminator can exist!

</div>

<div v-click="3">

For such low-dimensional, disjoint manifolds:

$$
\KL(\pd\,\|\,\pt)=\KL(\pt\,\|\,\pd)=\infty,\quad\JSD(\pd\,\|\,\pt)=\log2
$$

</div>



<div class="source"><a href="https://arxiv.org/abs/1904.08994">Weng L. From GAN to WGAN, 2019</a><br><a href="https://arxiv.org/abs/1701.04862">Arjovsky M., Bottou L. Towards Principled Methods for Training Generative Adversarial Networks, 2017</a></div>

---
clicks: 0
sourceFrame: "18"
class: theorems
---

# Wasserstein Distance (Discrete)

Also known as the **Earth Mover's Distance**.

<div class="block">

## Optimal Transport Formulation

The minimum cost of moving and transforming a pile of “dirt” shaped like one probability distribution to match another.

</div>

<img src="/figs/discrete_wasserstein.png" alt="discrete wasserstein" style="width: 100%; height: 285px; object-fit: contain; margin: 0 auto;" />



<div class="source"><a href="https://udlbook.github.io/udlbook/">Simon J.D. Prince. Understanding Deep Learning, 2023</a></div>

---
clicks: 1
sourceFrame: "19"
class: theorems
---

# Wasserstein Distance (Continuous)

$$
\begin{aligned}
W(\pi\|p)&=\inf_{\gamma\in\Gamma(\pi,p)}\bbE_{(\bx_1,\bx_2)\sim\gamma}\|\bx_1-\bx_2\|\\
&=\inf_{{\color{olive}\gamma}\in{\color{teal}\Gamma(\pi,p)}}\int{\color{#8854c0}\|\bx_1-\bx_2\|}\,{\color{olive}\gamma(\bx_1,\bx_2)}d\bx_1d\bx_2
\end{aligned}
$$


- ${\color{olive}\gamma(\bx_1,\bx_2)}$ is the transport plan: the amount of “dirt” assigned from $\bx_1$ to $\bx_2$.

$$
\int\gamma(\bx_1,\bx_2)d\bx_1=p(\bx_2);\quad\int\gamma(\bx_1,\bx_2)d\bx_2=\pi(\bx_1).
$$

- ${\color{teal}\Gamma(\pi,p)}$ denotes the set of all joint distributions $\gamma(\bx_1,\bx_2)$ with marginals $\pi$ and $p$.
- ${\color{olive}\gamma(\bx_1,\bx_2)}$ is the mass, ${\color{#8854c0}\|\bx_1-\bx_2\|}$ is the distance.
<div v-click="1">

<div class="block">

## Wasserstein Metric

$$
W_s(\pi,p)=\inf_{\gamma\in\Gamma(\pi,p)}\Bigl(\bbE_{(\bx_1,\bx_2)\sim\gamma}\|\bx_1-\bx_2\|^s\Bigr)^{1/s}
$$

</div>

In our setting, $W(\pi\|p)=W_1(\pi,p)$, which is the transport cost formulation.

In Lecture 12, minibatch optimal transport pairs noise and data samples for flow matching.

</div>



<div class="source"><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 4
sourceFrame: "20"
class: theorems
---

# Wasserstein Distance vs KL vs JSD

<div class="columns" style="grid-template-columns: 1.2fr 1fr;">
<div>

Consider two-dimensional distributions:

$$
\pd(x,y)=(0,U[0,1]),\qquad\pt(x,y)=(\theta,U[0,1])
$$


</div>
<img src="/figs/w_kl_jsd.png" alt="w kl jsd" style="width: 100%; height: 155px; object-fit: contain; margin: 0 auto;" />


</div>
<div v-click="1">

$\theta=0$: Both distributions are identical.

$$
\KL(\pd\|\pt)=\KL(\pt\|\pd)=\JSD(\pt\|\pd)=W(\pd\|\pt)=0
$$

</div>

<div v-click="2">

$\theta\neq0$:

$$
\KL(\pd\|\pt)=\int_{U[0,1]}1\log\frac10\,dy=\infty=\KL(\pt\|\pd)
$$

</div>

<div v-click="3">

$$
\JSD(\pd\|\pt)=\frac12\left(\int_{U[0,1]}1\log\frac1{1/2}dy+\int_{U[0,1]}1\log\frac1{1/2}dy\right)=\log2
$$

</div>

<div v-click="4">

$$
W(\pd\|\pt)=|\theta|
$$

</div>



<div class="source"><a href="https://arxiv.org/abs/1904.08994">Weng L. From GAN to WGAN, 2019</a><br><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 1
sourceFrame: "21"
class: theorems
---

# Why Wasserstein Distance?

On a compact data space $\cX$:

<div class="block">

## Dependence on Generator Parameters

For a feedforward generator $\bG_{\btheta}$ with Lipschitz activations and $\bbE_{p(\bz)}\|\bz\|<\infty$, $W(\pd\|\pt)$ is continuous in $\btheta$ and differentiable almost everywhere.

</div>

<div v-click="1">

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

<!-- The preceding parallel-lines example illustrates both properties. Continuity and almost-everywhere differentiability do not guarantee a nonzero gradient or successful WGAN training. The generator statement uses the feedforward-network corollary in the cited paper; its conditions include standard affine layers and Lipschitz activations. -->

---
clicks: 0
sourceFrame: "auto: Wasserstein GAN (WGAN)"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item current"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · Precision-Recall · CLIP Score · Human Eval</div></div></div>
<div class="outline-item"><span>05</span><div>Langevin Dynamics</div></div>

</div>

---
clicks: 3
sourceFrame: "22"
class: theorems
---

# Wasserstein GAN

<div class="block">

## Wasserstein Distance

$$
\begin{aligned}
W(\pi\|p)&=\inf_{\gamma\in\Gamma(\pi,p)}\bbE_{(\bx_1,\bx_2)\sim\gamma}\|\bx_1-\bx_2\|\\
&=\inf_{\gamma\in\Gamma(\pi,p)}\int\|\bx_1-\bx_2\|\gamma(\bx_1,\bx_2)\,d\bx_1\,d\bx_2
\end{aligned}
$$

</div>

<div v-click="1">

The infimum over all possible $\gamma\in\Gamma(\pi,p)$ is computationally intractable.

</div>

<div class="block" v-click="2">

## Theorem (Kantorovich-Rubinstein Duality)

$$
W(\pi\|p)=\frac1K\max_{\|f\|_L\leq K}\Bigl[\bbE_{\pi(\bx)}f(\bx)-\bbE_{p(\bx)}f(\bx)\Bigr]
$$

where $f:\bbR^m\rightarrow\bbR$ is $K$-Lipschitz ($\|f\|_L\leq K$):

$$
|f(\bx_1)-f(\bx_2)|\leq K\|\bx_1-\bx_2\|,\quad\forall\ \bx_1,\bx_2\in\cX.
$$

</div>

<div v-click="3">

We can thus estimate $W(\pi\|p)$ using only samples and a function $f$.

</div>



<div class="source"><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 1
sourceFrame: "23"
class: theorems
---

# Wasserstein GAN

<div class="block">

## Theorem (Kantorovich-Rubinstein Duality)

$$
W(\pd\|\pt)=\frac1K\max_{\|f\|_L\leq K}\Bigl[\bbE_{\pd(\bx)}f(\bx)-\bbE_{\pt(\bx)}f(\bx)\Bigr]
$$

</div>


- We must ensure that $f$ is $K$-Lipschitz continuous.
- Let $f_{\bphi}(\bx)$ be a feedforward neural network parameterized by $\bphi$.
- If the weights $\bphi$ are restricted to a compact set $\bPhi$, then $f_{\bphi}$ is $K$-Lipschitz.
<div v-click="1">

- Clamp weights within the box $\bPhi=[-c,c]^d$ (e.g. $c=0.01$) after each update.

$$
\begin{aligned}
K\cdot W(\pd\|\pt)&=\max_{\|f\|_L\leq K}\Bigl[\bbE_{\pd(\bx)}f(\bx)-\bbE_{\pt(\bx)}f(\bx)\Bigr]\\
&\geq\max_{\bphi\in\bPhi}\Bigl[\bbE_{\pd(\bx)}f_{\bphi}(\bx)-\bbE_{\pt(\bx)}f_{\bphi}(\bx)\Bigr]
\end{aligned}
$$

</div>



<div class="source"><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 1
sourceFrame: "24"
class: theorems
---

# Wasserstein GAN

<div class="block">

## Standard GAN Objective

$$
\min_{\btheta}\max_{\bphi}\bbE_{\pd(\bx)}\log D_{\bphi}(\bx)+\bbE_{p(\bz)}\log(1-D_{\bphi}(\bG_{\btheta}(\bz)))
$$

</div>

<div class="block">

## WGAN Objective

$$
\min_{\btheta}{\color{#8854c0}W(\pd\|\pt)}\approx\min_{\btheta}{\color{#8854c0}\max_{\bphi\in\bPhi}\Bigl[\bbE_{\pd(\bx)}f_{\bphi}(\bx)-\bbE_{p(\bz)}f_{\bphi}(\bG_{\btheta}(\bz))\Bigr]}
$$

</div>

<div v-click="1">

- The discriminator $D$ is replaced by function $f$: in WGAN, it is known as the **critic**, which is *not* a classifier.
- *“Weight clipping is a clearly terrible way to enforce a Lipschitz constraint.”*
  - If $c$ is large, optimizing the critic is hard; if $c$ is small, gradients may vanish.

**Gradient penalty** encourages the critic’s input-gradient norm to stay close to 1 on interpolations between real and generated samples.

**Spectral normalization** controls layer-wise Lipschitz constants by dividing weight matrices by their largest singular values.

</div>



<div class="source"><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a><br><a href="https://arxiv.org/abs/1704.00028">Gulrajani I. et al. Improved Training of Wasserstein GANs, 2017</a><br><a href="https://arxiv.org/abs/1802.05957">Miyato T. et al. Spectral Normalization for Generative Adversarial Networks, 2018</a></div>

---
clicks: 0
sourceFrame: "25"
class: theorems
---

# Wasserstein GAN

<div class="columns" style="grid-template-columns: 1.4fr 1fr;">
<div>


- WGAN provides nonzero gradients even if distributions' supports are disjoint.
- $\JSD(\pd\|\pt)$ is poorly correlated with sample quality and remains near its maximum value $\log2\approx0.69$.
- $W(\pd\|\pt)$ is tightly correlated with quality.

</div>
<img src="/figs/wgan_toy.png" alt="wgan toy" style="width: 100%; height: 240px; object-fit: contain; margin: 0 auto;" />


</div>
<div class="columns">
<img src="/figs/dcgan_quality.png" alt="dcgan quality" style="width: 100%; height: 220px; object-fit: contain; margin: 0 auto;" />

<img src="/figs/wgan_quality.png" alt="wgan quality" style="width: 100%; height: 220px; object-fit: contain; margin: 0 auto;" />


</div>

<div class="source"><a href="https://arxiv.org/abs/1701.07875">Arjovsky M., Chintala S., Bottou L. Wasserstein GAN, 2017</a></div>

---
clicks: 0
sourceFrame: "auto: Evaluation of Likelihood-Free Models"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item current"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · Precision-Recall · CLIP Score · Human Eval</div></div></div>
<div class="outline-item"><span>05</span><div>Langevin Dynamics</div></div>

</div>

---
clicks: 3
sourceFrame: "26"
class: theorems
---

# What Makes a Good Generator?

Likelihood alone does not tell us whether samples are useful for the target task.

<div class="columns" style="grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; margin-top: 24px;">
<div v-click="1">

## Fidelity

Does each sample look plausible?

<img src="/figs/evaluation_fidelity.png" alt="Synthetic failure case: a sharp photograph-like image of a hand with six digits." style="width: 100%; height: 230px; object-fit: contain; margin: 16px auto;" />

Sharp, but anatomically wrong.

</div>
<div v-click="2">

## Coverage & Diversity

Does the set cover the data?

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; width: 230px; height: 230px; margin: 16px auto;">
<img src="/figs/evaluation_diversity.png" alt="Synthetic run 1: the same dog portrait." style="width: 111px; height: 111px; object-fit: cover;" />
<img src="/figs/evaluation_diversity.png" alt="Synthetic run 2: the same dog portrait." style="width: 111px; height: 111px; object-fit: cover;" />
<img src="/figs/evaluation_diversity.png" alt="Synthetic run 3: the same dog portrait." style="width: 111px; height: 111px; object-fit: cover;" />
<img src="/figs/evaluation_diversity.png" alt="Synthetic run 4: the same dog portrait." style="width: 111px; height: 111px; object-fit: cover;" />
</div>

The same output on every run.

</div>
<div v-click="3">

## Condition Alignment

Does it follow the condition?

<img src="/figs/evaluation_alignment.png" alt="Synthetic failure case: exactly two red apples on a white plate although the condition asks for three." style="width: 100%; height: 230px; object-fit: contain; margin: 16px auto;" />

Prompt: “Three red apples.”<br>
Result: only two.

</div>
</div>

<div class="source">Illustrative failure cases created for this lecture.<br><a href="https://arxiv.org/abs/1511.01844">Theis L. et al. A Note on the Evaluation of Generative Models, 2016</a> · <a href="https://arxiv.org/abs/1904.06991">Kynkäänniemi T. et al. Improved Precision and Recall Metric for Assessing Generative Models, 2019</a><br><a href="https://arxiv.org/abs/2404.01291">Lin Z. et al. Evaluating Text-to-Visual Generation with Image-to-Text Generation, 2024</a></div>

<!--
The author requested replacing the dated Sharpness / Diversity introduction with
Fidelity / Coverage & Diversity / Condition Alignment, including visual failures.
The hand, dog, and apples are deliberately created synthetic teaching examples,
not empirical outputs from an evaluated generator. The dog image is repeated
exactly in HTML to illustrate extreme mode collapse, not four independent draws.
Coverage concerns the target distribution: arbitrary variation or noise alone is
not sufficient. The repeated-dog example assumes a non-degenerate target with
many valid images. Conditional diversity is assessed for a fixed condition;
condition alignment is relevant when a condition is given.
A sharp image can have wrong anatomy; a plausible image can violate its prompt;
high-quality individual samples do not establish distributional coverage.
Likelihood remains useful for density estimation and model comparison, but it
alone does not establish task-specific visual quality or usefulness.
The three axes are complementary, not mathematically independent or exhaustive.
Existing downstream slides introduce distributional metrics, precision/recall,
text-image alignment, preference scores, and human judgments.
Historical source of the replaced illustrations:
<a href="https://deepgenerativemodels.github.io">Stanford Deep Generative Models</a>.
-->

---
clicks: 0
sourceFrame: "auto: Frechet Inception Distance (FID)"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item current"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub"><b>Frechet Inception Distance (FID)</b> · Precision-Recall · CLIP Score · Human Eval</div></div></div>
<div class="outline-item"><span>05</span><div>Langevin Dynamics</div></div>

</div>

---
clicks: 3
sourceFrame: "27"
class: theorems
---

# Wasserstein Metric

$$
W_s(\pi\|p)=\inf_{\gamma\in\Gamma(\pi,p)}\left(\bbE_{(\bx_1,\bx_2)\sim\gamma}\|\bx_1-\bx_2\|^s\right)^{1/s}
$$

<div class="block" v-click="1">

## Wasserstein GAN (Optimal Transport)

$$
\begin{aligned}
W(\pi\|p)&=\inf_{\gamma\in\Gamma(\pi,p)}\bbE_{(\bx_1,\bx_2)\sim\gamma}\|\bx_1-\bx_2\|\\
&=\inf_{\gamma\in\Gamma(\pi,p)}\int\|\bx_1-\bx_2\|\gamma(\bx_1,\bx_2)\,d\bx_1\,d\bx_2
\end{aligned}
$$

</div>

<div class="block" v-click="2">

## Theorem

If $\pi(\bx)=\cN(\bmu_\pi,\bSigma_\pi)$, $p(\bx)=\cN(\bmu_p,\bSigma_p)$, then

$$
W_2^2(\pi\|p)=\|\bmu_\pi-\bmu_p\|^2+\tr\left[\bSigma_\pi+\bSigma_p-2\left(\bSigma_\pi^{1/2}\bSigma_p\bSigma_\pi^{1/2}\right)^{1/2}\right]
$$

</div>

<div class="block" v-click="3">

## Frechet Inception Distance

$$
\FID(\pd,\pt)=W_2^2(\pd\|\pt)
$$

</div>



<div class="source"><a href="https://arxiv.org/abs/1706.08500">Heusel M. et al. GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium, 2017</a></div>

---
clicks: 1
sourceFrame: "28"
class: theorems
---

# Frechet Inception Distance (FID)

$$
\FID(\pd,\pt)=\|\bmu_{\text{data}}-\bmu_{\btheta}\|^2+\tr\left[\bSigma_{\text{data}}+\bSigma_{\btheta}-2\left(\bSigma_{\text{data}}^{1/2}\bSigma_{\btheta}\bSigma_{\text{data}}^{1/2}\right)^{1/2}\right]
$$


- FID uses Inception image embeddings $\bz=\bff(\bx)$.
- $\bmu_{\text{data}}$, $\bSigma_{\text{data}}$ and $\bmu_{\btheta}$, $\bSigma_{\btheta}$ are statistics of latent representations for samples from $\pd(\bx)$ and $\pt(\bx)$.
- **FD-DINOv2** uses the same formula with DINOv2 features; the Gaussian approximation remains.
<div class="block" v-click="1">

## $\FID(p(\bx),\cN(0,\bI))$

<img src="/figs/fid_normal.png" alt="fid normal" style="width: 100%; height: 205px; object-fit: contain; margin: 0 auto;" />

</div>



<div class="source"><a href="https://arxiv.org/abs/2401.09603">Jayasumana S. et al. Rethinking FID: Towards a Better Evaluation Metric for Image Generation, 2024</a><br><a href="https://arxiv.org/abs/2306.04675">Stein G. et al. Exposing Flaws of Generative Model Evaluation Metrics and Their Unfair Treatment of Diffusion Models, 2023</a></div>

---
clicks: 1
sourceFrame: "29"
class: theorems
---

# Frechet Inception Distance (FID)

$$
\FID(\pd,\pt)=\|\bmu_{\text{data}}-\bmu_{\btheta}\|^2+\tr\left[\bSigma_{\text{data}}+\bSigma_{\btheta}-2\left(\bSigma_{\text{data}}^{1/2}\bSigma_{\btheta}\bSigma_{\text{data}}^{1/2}\right)^{1/2}\right]
$$

<div v-click="1">

<div class="block">

## Drawbacks

- Depends on the pretrained classification network.
- Uses the normality assumption.
- May not correlate with human evaluation.

</div>

Finite-sample FID is biased, and its value depends on the sample size.

<img src="/figs/fid_vs_human_eval.png" alt="fid vs human eval" style="width: 100%; height: 185px; object-fit: contain; margin: 0 auto;" />

</div>



<div class="source"><a href="https://arxiv.org/abs/2401.09603">Jayasumana S. et al. Rethinking FID: Towards a Better Evaluation Metric for Image Generation, 2024</a></div>

---
clicks: 2
sourceFrame: "extension: 29"
class: theorems
---

# Maximum Mean Discrepancy (MMD)

The earlier figure shows that matching means and covariances can miss changes in shape.
For embedding distributions $P,Q$, compare means of richer nonlinear features $\psi$:

$$
\bmu_P=\bbE_{\bz\sim P}\psi(\bz),\qquad
\bmu_Q=\bbE_{\bw\sim Q}\psi(\bw).
$$

<div class="block" v-click="1">

## Kernel Trick

$$
k(\ba,\bu)=\langle\psi(\ba),\psi(\bu)\rangle.
$$

Compute inner products directly, without explicitly constructing $\psi$.

</div>

<div class="block" v-click="2">

## Distance Between Mean Features

Let $\bz,\bz'\sim P$ and $\bw,\bw'\sim Q$ be mutually independent.

$$
\begin{aligned}
\MMD_k^2(P,Q)&=\|\bmu_P-\bmu_Q\|^2\\
&=\langle\bmu_P,\bmu_P\rangle+\langle\bmu_Q,\bmu_Q\rangle-2\langle\bmu_P,\bmu_Q\rangle\\
&=\underbrace{\bbE k(\bz,\bz')}_{\text{within }P}
+\underbrace{\bbE k(\bw,\bw')}_{\text{within }Q}
-2\underbrace{\bbE k(\bz,\bw)}_{\text{between }P,Q}.
\end{aligned}
$$

</div>

<div class="source"><a href="https://jmlr.org/papers/v13/gretton12a.html">Gretton A. et al. A Kernel Two-Sample Test, 2012</a></div>

<!-- The motivation is the synthetic figure on slide 29, so no separate scalar example is needed. P,Q are distributions of image embeddings z=f(x), not of pixels. psi is a fixed mathematical feature map, not another trained encoder; it may have infinitely many coordinates. Independence gives <E psi(z), E psi(z')> = E <psi(z), psi(z')> = E k(z,z'), and similarly for the other two terms. For a positive-definite kernel, psi maps into its reproducing kernel Hilbert space. The name Maximum Mean Discrepancy comes from the equivalent supremum of E_P h - E_Q h over the RKHS unit ball, ||h|| <= 1; an unrestricted supremum would be unbounded. -->

---
clicks: 1
sourceFrame: "extension: 29"
class: theorems
---

# CMMD: Comparing CLIP Image Embeddings

**CMMD** = squared MMD on **CLIP image embeddings**.

$$
\MMD_k^2(P,Q)=\bbE k(\bz,\bz')+\bbE k(\bw,\bw')-2\bbE k(\bz,\bw).
$$

$$
k(\bz,\bw)=\exp\!\left(-\frac{\|\bz-\bw\|^2}{2\sigma^2}\right),\qquad \sigma>0.
$$

One Gaussian kernel already corresponds to infinitely many nonlinear features in $\psi$.

$$
\MMD_k(P,Q)=0\quad\Longleftrightarrow\quad P=Q.
$$

<div v-click="1">

<img src="/figs/mmd_normal.png" alt="Distributions with identical means and covariances: Frechet distance stays zero while MMD increases as their shapes diverge." style="width: 100%; height: 210px; object-fit: contain; margin: 8px auto 0;" />

Synthetic example: same means and covariances, different shapes.

</div>

<div class="source"><a href="https://arxiv.org/abs/2401.09603">Jayasumana S. et al. Rethinking FID: Towards a Better Evaluation Metric for Image Generation, 2024</a></div>

<!-- Oral explanations moved off the slide: CLIP is trained on image-text pairs; CMMD uses only its image encoder. The Gaussian kernel is near 1 for close embeddings and near 0 for distant ones. Estimate the three expectations from average kernel values over independent sample pairs. No Gaussian fit is needed, but the image encoder and bandwidth still affect the score. The Gaussian kernel corresponds to a rich, infinite-dimensional feature map. Equality of embedding distributions does not imply equality of pixel-space image distributions when the encoder is not injective. This figure is the synthetic MMD example from the paper, not CMMD computed on CLIP images. For independent sample sets z_1,...,z_m and w_1,...,w_n, use the unbiased estimator: sum_{i != j} k(z_i,z_j)/(m(m-1)) + sum_{i != j} k(w_i,w_j)/(n(n-1)) - 2 sum_{i,j} k(z_i,w_j)/(mn). Omitting within-set diagonals removes self-pair bias; this finite-sample estimate can be slightly negative even though population MMD squared is nonnegative. Published CMMD uses CLIP ViT-L/14@336px, sigma=10, and multiplies the estimate by 1000. Unlike the later CLIP score, CMMD compares two image sets; it does not directly evaluate each image against its prompt. -->

---
clicks: 0
sourceFrame: "auto: Precision-Recall"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item current"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · <b>Precision-Recall</b> · CLIP Score · Human Eval</div></div></div>
<div class="outline-item"><span>05</span><div>Langevin Dynamics</div></div>

</div>

---
clicks: 1
sourceFrame: "30"
class: theorems
---

# Precision-Recall

<div class="block">

## Desirable Properties for Samples

- **Sharpness:** generated samples should possess high visual quality.
- **Diversity:** their variation should match that in the training data.

</div>

<div v-click="1">

<img src="/figs/pr_curve.png" alt="pr curve" style="width: 100%; height: 215px; object-fit: contain; margin: 0 auto;" />


- **Precision** denotes the fraction of generated images that look realistic.
- **Recall** measures how well the generator covers the training data manifold.

</div>



<div class="source"><a href="https://arxiv.org/abs/1904.06991">Kynkäänniemi T. et al. Improved precision and recall metric for assessing generative models, 2019</a></div>

---
clicks: 4
sourceFrame: "31"
class: theorems
---

# Precision-Recall

- $\cS_{\text{data}}=\{\bx_i\}_{i=1}^{n}\sim\pd(\bx)$ — real samples;
- $\cS_{\btheta}=\{\bx_i\}_{i=1}^{n}\sim\pt(\bx)$ — generated samples.
<div v-click="1">

Define a binary function:

$$
\bbI(\bx,\cS)=\begin{cases}
1,&\text{if }\exists\ \bx'\in\cS:\|\bx-\bx'\|_2\leq\|\bx'-\NN_k(\bx',\cS)\|_2;\\
0,&\text{otherwise.}
\end{cases}
$$

</div>

<div v-click="2">

$$
\text{Pr}(\cS_{\text{data}},\cS_{\btheta})=\frac1n\sum_{\bx\in\cS_{\btheta}}\bbI(\bx,\cS_{\text{data}});\quad
\text{Rec}(\cS_{\text{data}},\cS_{\btheta})=\frac1n\sum_{\bx\in\cS_{\text{data}}}\bbI(\bx,\cS_{\btheta}).
$$

</div>

<img src="/figs/pr_k_nearest.png" alt="pr k nearest" style="width: 100%; height: 160px; object-fit: contain; margin: 0 auto;" v-click="3" />

<div v-click="4">

Embed the samples using a pretrained network (as in FID).

</div>



<div class="source"><a href="https://arxiv.org/abs/1904.06991">Kynkäänniemi T. et al. Improved precision and recall metric for assessing generative models, 2019</a></div>

---
clicks: 1
sourceFrame: "32"
class: theorems
---

# Precision-Recall

<img src="/figs/pr_vs_fid.png" alt="pr vs fid" style="width: 100%; height: 265px; object-fit: contain; margin: 0 auto;" />

<div v-click="1">

<img src="/figs/pr_truncation.png" alt="pr truncation" style="width: 100%; height: 220px; object-fit: contain; margin: 0 auto;" />

Here, stronger truncation (smaller $\psi$) favors precision over recall.

</div>



<div class="source"><a href="https://arxiv.org/abs/1904.06991">Kynkäänniemi T. et al. Improved precision and recall metric for assessing generative models, 2019</a></div>

---
clicks: 0
sourceFrame: "auto: CLIP Score"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item current"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · Precision-Recall · <b>CLIP Score</b> · Human Eval</div></div></div>
<div class="outline-item"><span>05</span><div>Langevin Dynamics</div></div>

</div>

---
clicks: 1
sourceFrame: "33"
class: theorems
---

# CLIP Similarity and Human Preferences

Score an image $\bx$ for a text prompt $t$.

<div class="block">

## CLIP: Learn from Image–Caption Pairs

Map images and text into a shared embedding space:

$$
s_{\text{CLIP}}(\bx,t)=\cos\!\left(\bff_{\text{img}}(\bx),\bff_{\text{text}}(t)\right).
$$

</div>

<div v-click="1">
<div class="block">

## PickScore: Learn from Human Choices

Fine-tune CLIP on pairs: for the same prompt, a human prefers $\bx^+$ to $\bx^-$.

$$
\bbP_{\btheta}(\bx^+\succ\bx^-\mid t)=
\frac{\exp r_{\btheta}(\bx^+,t)}{\exp r_{\btheta}(\bx^+,t)+\exp r_{\btheta}(\bx^-,t)}.
$$

Train the score $r_{\btheta}$ to assign higher probability to the human choice.

</div>

Other preference models: **[ImageReward](https://arxiv.org/abs/2304.05977)**, **[HPSv2](https://arxiv.org/abs/2306.09341)**.

A learned preference score can guide sample selection and model training — but optimizing the score can exploit its flaws.

</div>

<div class="source"><a href="https://arxiv.org/abs/2103.00020">Radford A. et al. Learning Transferable Visual Models From Natural Language Supervision, 2021</a><br><a href="https://arxiv.org/abs/2305.01569">Kirstain Y. et al. Pick-a-Pic: An Open Dataset of User Preferences for Text-to-Image Generation, 2023</a></div>

<!--
The displayed CLIP score is cosine similarity, the common text-to-image convention.
The original captioning CLIPScore additionally clips negative values and multiplies
by 2.5 (Hessel et al., https://arxiv.org/abs/2104.08718). Such conventions change
reported scales; do not compare raw scores across implementations.
PickScore retains CLIP's two encoders and a learned logit scale; r_theta absorbs
that scale. Fine-tuning changes the supervision from matching image-caption pairs
to pairwise preferences, not the broad two-encoder architecture. For a strict human
choice, minimize -log P_theta(x+ preferred to x- | t). Pick-a-Pic also includes ties,
represented by a target distribution (1/2,1/2) in the two-way cross-entropy.
A reward-model score predicts preferences in its training population; it is not a
calibrated absolute image-quality score or a guarantee of prompt correctness.
ImageReward: https://arxiv.org/abs/2304.05977. HPSv2: https://arxiv.org/abs/2306.09341.
The earlier unconditional/conditional cartoons and CLIP architecture image are
replaced by this compact explanation to keep the whole topic to two slides.
-->

---
clicks: 1
sourceFrame: "extension: 33"
class: theorems
---

# Does the Image Follow the Prompt?

Prompt $t$: **“A red cube above a blue sphere.”**

<img src="/figs/prompt_relation.svg" alt="Original schematic: the left image has a red cube above a blue sphere; the right image reverses their vertical positions." style="width: 100%; height: 210px; object-fit: contain; margin: 8px auto;" />

Same objects and colors; opposite spatial relation. CLIP similarity can miss this.

<div v-click="1">
<div class="block">

## VQAScore: Ask a Visual Question

$q(t)$: “Does this image show a red cube above a blue sphere?”

$$
s_{\text{VQA}}(\bx,t)=p_{\text{VQA}}(\text{Yes}\mid\bx,q(t)).
$$

</div>

**GenEval / DPG-Bench:** test objects, counts, attributes, and relations across prompts.

</div>

<div class="source"><a href="https://arxiv.org/abs/2404.01291">Lin Z. et al. Evaluating Text-to-Visual Generation with Image-to-Text Generation, 2024</a><br><a href="https://arxiv.org/abs/2310.11513">Ghosh D. et al. GenEval: An Object-Focused Framework for Evaluating Text-to-Image Alignment, 2023</a><br><a href="https://arxiv.org/abs/2403.05135">Hu X. et al. ELLA: Equip Diffusion Models with LLM for Enhanced Semantic Alignment, 2024 (DPG-Bench)</a></div>

<!--
Original schematic, not generated samples and not a measured CLIP/VQA experiment.
No numerical scores or guaranteed ranking are claimed for these two drawings.
VQAScore uses the model likelihood of the answer "Yes", not a binary generated
answer and not a calibrated probability that the image is objectively correct.
The paper's question template is "Does this figure show '{text}'? Please answer
yes or no." The displayed question is the natural-language instantiation for our
example; prompt-template choices are part of the evaluation protocol.
VQAScore asks about the whole prompt. Do not conflate it with decomposing the prompt
into separate object/relation questions: GenEval uses object-focused checks, while
DPG-Bench evaluates dense prompts using a dependency-aware question graph.
Preference and compositional correctness can disagree; no learned evaluator is
perfect. The next Human Evaluation slide motivates validation with human judgments.
-->

---
clicks: 0
sourceFrame: "auto: Human Eval"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item current"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · Precision-Recall · CLIP Score · <b>Human Eval</b></div></div></div>
<div class="outline-item"><span>05</span><div>Langevin Dynamics</div></div>

</div>

---
clicks: 1
sourceFrame: "34"
class: theorems
---

# Human Evaluation

<div class="columns" style="grid-template-columns: 0.72fr 1.28fr; align-items: start; margin-top: 12px;">
<div>

- No automated metric is perfect.
- The best way to evaluate generative models is by human assessment.
- It's important to assess various properties.

</div>

<img src="/figs/alice_ai_art_2_evaluation.png" alt="Alice AI ART 2.0 image-editing evaluation: good and bad examples for instruction relevance, preservation of unchanged content, and visual defects." style="width: 100%; height: 530px; object-fit: contain; margin: 0 auto;" v-click="1" />

</div>

<div class="source"><a href="https://habr.com/ru/companies/yandex/articles/1058630/">Yandex. Alice AI ART 2.0: A Unified Model for Image Generation and Editing</a></div>

<!--
The author requested this exact image and article. It illustrates evaluation of
image editing (I2I): instruction relevance, preservation, and defects. The full
image is preserved without cropping or translation; its labels are in Russian.
The article uses human assessors as well as automated reward models / VLM judges;
this illustration presents evaluation criteria rather than an Arena-style ranking.
Historical source of the replaced Beamer illustration:
<a href="https://ya.ru/ai/art">YandexART 2.5</a>.
-->

---
clicks: 0
sourceFrame: "auto: Langevin Dynamics"
---

# Outline

<div class="course-outline" style="margin-top: 24px;">
<div class="outline-item"><span>01</span><div>Generative Adversarial Networks (GAN)</div></div>
<div class="outline-item"><span>02</span><div>Wasserstein Distance</div></div>
<div class="outline-item"><span>03</span><div>Wasserstein GAN (WGAN)</div></div>
<div class="outline-item"><span>04</span><div>Evaluation of Likelihood-Free Models<div class="outline-sub">Frechet Inception Distance (FID) · Precision-Recall · CLIP Score · Human Eval</div></div></div>
<div class="outline-item current"><span>05</span><div>Langevin Dynamics</div></div>

</div>

---
clicks: 2
sourceFrame: "imported: 6:13"
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
clicks: 1
sourceFrame: "imported: 6:14"
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


<div class="source"><a href="https://arxiv.org/abs/2510.21890">Lai C. H. et al. The principles of diffusion models, 2025.</a></div>

---
clicks: 0
sourceFrame: "35"
class: summary
---

# Summary

- GANs can suffer from mode collapse; KL and Jensen-Shannon measure mismatch differently.
- Perceptual and adversarial losses train autoencoders; learned priors model their latents.
- WGAN uses Kantorovich-Rubinstein duality to estimate a distance informative even for disjoint supports; weight clipping constrains the critic.
- FID compares Gaussian approximations; CMMD compares distributions of CLIP features using a kernel.
- Precision-recall measures the balance between sample quality and diversity.
- Image–text similarity, human preference, and compositional correctness require different evaluation signals.
- Langevin dynamics uses log-density gradients and Gaussian noise to sample from an unnormalized model.
