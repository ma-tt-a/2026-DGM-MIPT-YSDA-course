---
theme: ../theme
layout: default
title: "Deep Generative Models — Lecture 8"
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
omittedSourceFrames: [2, 3, 4, 9, 10, 11, 12, 13, 14, 15, 16]
omittedSourceSections: ["Diffusion ELBO Derivation (continued)", "Gaussian Diffusion Reparametrization"]
sectionTitleOverrides: {"Denoising Diffusion Probabilistic Model (DDPM)": "DDPM as a Score-Based Generative Model"}
sourceFrame: "1"
class: cover
---

<div class="cover-kicker">MIPT & YSDA · AUTUMN 2026</div>

# Deep Generative Models

<div class="cover-lecture">Lecture 8</div>

Roman Isachenko

<div class="cover-institute">Moscow Institute of Physics and Technology<br>Yandex School of Data Analysis</div>

---
clicks: 0
sourceFrame: "5"
class: theorems
---

# Recap of Previous Lecture

<img src="/figs/DDPM.png" alt="Forward and reverse diffusion processes" style="width:100%;height:220px;object-fit:contain" />

<div class="block">

## Reverse Process (Ancestral Sampling)

$$
\begin{aligned}
q(\bx_{t-1}|\bx_t)&=\frac{q(\bx_t|\bx_{t-1}){\color{#8854c0}q(\bx_{t-1})}}{{\color{#8854c0}q(\bx_t)}}\\
&\approx\pt(\bx_{t-1}|\bx_t)=\cN\left(\bmu_{\btheta,t}(\bx_t),\bsigma_{\btheta,t}^2(\bx_t)\right)
\end{aligned}
$$

<span style="color:gray">If $\beta_t$ is sufficiently small, $q(\bx_{t-1}|\bx_t)$ is approximately Gaussian.</span>

</div>

<div class="source"><a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/">Weng L. What are Diffusion Models?, blog post, 2021</a></div>

---
clicks: 0
sourceFrame: "extension: 5"
class: theorems
---

# Recap of Previous Lecture

<div class="columns">
<div class="block">

## Forward Process

1. $\bx_0=\bx\sim\pd(\bx)$
2. $\bx_t=\sqrt{1-\beta_t}\bx_{t-1}+\sqrt{\beta_t}\bepsilon_t$
3. $\bx_T\sim p_\infty(\bx)=\cN(0,\bI)$

</div>
<div class="block">

## Reverse Process

1. $\bx_T\sim p_\infty(\bx)=\cN(0,\bI)$
2. $\bx_{t-1}=\bsigma_{\btheta,t}(\bx_t)\bepsilon+\bmu_{\btheta,t}(\bx_t)$
3. $\bx_0=\bx\sim\pd(\bx)$

</div>
</div>

<div class="source"><a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/">Weng L. What are Diffusion Models?, blog post, 2021</a></div>

---
clicks: 0
sourceFrame: "6"
class: theorems
---

# Recap of Previous Lecture

**Forward process** maps any distribution $\pd(\bx)$ to $\cN(0,\bI)$ by injection of noise:

$$
\begin{aligned}
q(\bx_t|\bx_{t-1})&=\cN(\sqrt{1-\beta_t}\,\bx_{t-1},\beta_t\,\bI);\\
q(\bx_t|\bx_0)&=\cN(\sqrt{\bar{\alpha}_t}\,\bx_0,(1-\bar{\alpha}_t)\,\bI).
\end{aligned}
$$

**Reverse process** refers to an intractable distribution that can be approximated by a normal distribution (with unknown parameters) for small $\beta_t$:

$$
q(\bx_{t-1}|\bx_t)=\frac{q(\bx_t|\bx_{t-1})q(\bx_{t-1})}{q(\bx_t)}\approx\cN\left(\bmu_{\btheta,t}(\bx_t),\bsigma_{\btheta,t}^2(\bx_t)\right)
$$

**Conditioned reverse process** is a normal distribution with known parameters, describing how to denoise a noisy image $\bx_t$ when we know the clean image $\bx_0$.

$$
q(\bx_{t-1}|\bx_t,{\color{olive}\bx_0})=\cN(\tilde{\bmu}_t(\bx_t,\bx_0),\tilde{\beta}_t\,\bI)
$$

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "7"
class: theorems
---

# Recap of Previous Lecture

- $\bz=(\bx_1,\dots,\bx_T)$ represents the latent variables.
- Variational posterior distribution:

$$
q(\bz|\bx)=q(\bx_1,\dots,\bx_T|\bx_0)=\prod_{t=1}^Tq(\bx_t|\bx_{t-1}).
$$

- Generative model and prior:

$$
\pt(\bx|\bz)=\pt(\bx_0|\bx_1);\quad\pt(\bz)=\prod_{t=2}^T\pt(\bx_{t-1}|\bx_t)\cdot p(\bx_T)
$$

<div class="source"><a href="https://ayandas.me/blog-tut/2021/12/04/diffusion-prob-models.html">Das A. An Introduction to Diffusion Probabilistic Models, blog post, 2021</a><br><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "extension: 7"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Standard ELBO

$$
\log\pt(\bx)\geq\bbE_{q({\color{teal}\bz}|\bx)}\log\frac{\pt(\bx,{\color{teal}\bz})}{q({\color{teal}\bz}|\bx)}=\cL_{\bphi,\btheta}(\bx)\rightarrow\max_{\bphi,\btheta}
$$

$$
\begin{aligned}
\cL_{\bphi,\btheta}(\bx)
&={\color{olive}\bbE_{q(\bx_1|\bx_0)}\log\pt(\bx_0|\bx_1)}-{\color{#8854c0}\KL\bigl(q(\bx_T|\bx_0)\|p(\bx_T)\bigr)}\\
&\quad-{\color{teal}\sum_{t=2}^T\underbrace{\bbE_{q(\bx_t|\bx_0)}\KL\bigl(q(\bx_{t-1}|\bx_t,\bx_0)\|\pt(\bx_{t-1}|\bx_t)\bigr)}_{\cL_t}}
\end{aligned}
$$

</div>

<div class="source"><a href="https://ayandas.me/blog-tut/2021/12/04/diffusion-prob-models.html">Das A. An Introduction to Diffusion Probabilistic Models, blog post, 2021</a><br><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "17"
class: theorems
---

# Recap of Previous Lecture

<div class="block">

## Training

1. Sample $\bx_0\sim\pd(\bx)$, $t\sim U\{1,T\}$, $\bepsilon\sim\cN(0,\bI)$.
2. Compute noisy image $\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon$.
3. Compute loss $\cL_{\text{simple}}=\|\bepsilon-\bepsilon_{\btheta,t}(\bx_t)\|^2$.

</div>
<div class="block">

## Sampling (Ancestral)

1. Sample $\bx_T\sim\cN(0,\bI)$.
2. Compute the mean of $\pt(\bx_{t-1}|\bx_t)=\cN(\bmu_{\btheta,t}(\bx_t),\tilde{\beta}_t\cdot\bI)$:

$$
\bmu_{\btheta,t}(\bx_t)=\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}\cdot\bepsilon_{\btheta,t}(\bx_t).
$$

3. Denoise $\bx_{t-1}=\bmu_{\btheta,t}(\bx_t)+\sqrt{\tilde{\beta}_t}\cdot\bepsilon$, $\bepsilon\sim\cN(0,\bI)$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "8"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>DDPM as a Score-Based Generative Model</div></div>
<div class="outline-item"><span>02</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 0
sourceFrame: "auto: DDPM as a Score-Based Generative Model"
---

# Outline

<div class="course-outline">

<div class="outline-item current"><span>01</span><div>DDPM as a Score-Based Generative Model</div></div>
<div class="outline-item"><span>02</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 3
sourceFrame: "18"
class: theorems
---

# Denoising Diffusion as a Score-Based Generative Model

<div class="block">

## DDPM Objective

$$ {1|all} {at:1}
\begin{aligned}
\cL_t&=\bbE_{\bepsilon\sim\cN(0,\bI)}\left[C_{1,t}\cdot\left\|\bepsilon_{\btheta,t}(\bx_t)-\bepsilon\right\|_2^2\right]\\
&=\bbE_{\bepsilon\sim\cN(0,\bI)}\left[C_{2,t}\cdot\Bigl\|{\color{#8854c0}\frac{\bepsilon_{\btheta,t}(\bx_t)}{\sqrt{1-\bar{\alpha}_t}}}-{\color{teal}\frac{\bepsilon}{\sqrt{1-\bar{\alpha}_t}}}\Bigr\|_2^2\right]
\end{aligned}
$$

</div>
<div v-click="2">

$$ {1|all} {at:3}
\begin{aligned}
q(\bx_t|\bx_0)&=\cN(\sqrt{\bar{\alpha}_t}\cdot\bx_0,(1-\bar{\alpha}_t)\cdot\bI)\\
\nabla_{\bx_t}\log q(\bx_t|\bx_0)&=-\frac{\bx_t-\sqrt{\bar{\alpha}_t}\cdot\bx_0}{1-\bar{\alpha}_t}={\color{teal}-\frac{\bepsilon}{\sqrt{1-\bar{\alpha}_t}}}.
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 1
sourceFrame: "extension: 18"
class: theorems
---

# Denoising Diffusion as a Score-Based Generative Model

We can reparameterize the model as:

$$
\bs_{\btheta,t}(\bx_t)={\color{#8854c0}-\frac{\bepsilon_{\btheta,t}(\bx_t)}{\sqrt{1-\bar{\alpha}_t}}}=\nabla_{\bx_t}\log\pt(\bx_t).
$$

This is the noise-to-score identity from **Tweedie's formula (Lecture 6)** at the MSE optimum.

<div v-click="1">

$$
\cL_t=\bbE_{q(\bx_t|\bx_0)}\left[C_{2,t}\cdot\Bigl\|\bs_{\btheta,t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx_0)\Bigr\|_2^2\right]
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 3
sourceFrame: "19"
class: theorems
---

# DDPM vs NCSN: Objectives

<div class="block">

## DDPM Objective

$$
\bbE_{\pd(\bx_0)}\bbE_{t\sim U\{1,T\}}\bbE_{q(\bx_t|\bx_0)}\left[{\color{olive}C_{2,t}}\Bigl\|\bs_{\btheta,t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx_0)\Bigr\|_2^2\right]
$$

$$
\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon
$$

<div v-click="1">

In practice, <span style="color:olive">this coefficient</span> is often omitted.

</div>
</div>
<div class="block" v-click="2">

## NCSN Objective

$$
\bbE_{\pd(\bx_0)}\bbE_{t\sim U\{1,T\}}\bbE_{q(\bx_t|\bx_0)}\bigl\|\bs_{\btheta,\sigma_t}(\bx_t)-\nabla_{\bx_t}\log q(\bx_t|\bx_0)\bigr\|_2^2
$$

$$
\bx_t=\bx_0+\sigma_t\cdot\bepsilon
$$

</div>
<div v-click="3">

**Maximizing the ELBO leads to the same objective as denoising score matching!**

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 2
sourceFrame: "20"
class: derivation
---

# DDPM vs NCSN: Sampling

<div class="block">

## Sampling (Ancestral)

$$ {1-2|1-3|all} {at:1}
\begin{aligned}
\bx_T&\sim\cN(0,\bI)\\
\bx_{t-1}&={\color{teal}\bmu_{\btheta,t}(\bx_t)}+\sigma_t\cdot\bepsilon\\
&={\color{teal}\frac{1}{\sqrt{\alpha_t}}\cdot\bx_t-\frac{1-\alpha_t}{\sqrt{\alpha_t(1-\bar{\alpha}_t)}}\cdot\bepsilon_{\btheta,t}(\bx_t)}+\sigma_t\cdot\bepsilon\\
&=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot\bs_{\btheta,t}(\bx_t)+\sigma_t\cdot\bepsilon
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 0
sourceFrame: "extension: 20"
class: theorems
---

# DDPM vs NCSN: Sampling

<div class="block">

## Sampling (Annealed Langevin Dynamics)

1. Sample $\bx_T^0\sim\cN(0,\sigma_T^2\,\bI)\approx q(\bx_T)$.
2. Update $\bx_t^l$ via $L$ steps of Langevin dynamics at each noise level $\sigma_t$:

$$
\bx_t^l=\bx_t^{l-1}+\frac{\eta_t}{2}\cdot\bs_{\btheta,\sigma_t}(\bx_t^{l-1})+\sqrt{\eta_t}\cdot\bepsilon_t^l.
$$

3. Update $\bx_{t-1}^0:=\bx_t^L$ and proceed to the next noise level $\sigma_{t-1}$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2006.11239">Ho J. Denoising Diffusion Probabilistic Models, 2020</a></div>

---
clicks: 2
sourceFrame: "21"
class: theorems
---

# DDPM vs NCSN: Summary

<div class="block">

## Summary

<ul>
<li>

Different Markov chains:

- DDPM: $\bx_t=\sqrt{\bar{\alpha}_t}\cdot\bx_0+\sqrt{1-\bar{\alpha}_t}\cdot\bepsilon$;
- NCSN: $\bx_t=\bx_0+\sigma_t\cdot\bepsilon$.
- One can generalize to $q(\bx_t|\bx_0)=\cN(\alpha_t\cdot\bx_0,\sigma_t^2\,\bI)$.

</li>
<li v-click="1">

The objectives coincide: ELBO $\equiv$ score-matching.

</li>
<li v-click="2">

The sampling procedures differ:

- Ancestral sampling in DDPM;
- Annealed Langevin dynamics for NCSN;
- Hybrid approaches that combine both updates are possible.

</li>
</ul>
</div>

<div class="source"><a href="https://arxiv.org/abs/2107.00630">Kingma D. et al. Variational Diffusion Models, 2021</a><br><a href="https://arxiv.org/abs/2011.13456">Song Y. et al. Score-Based Generative Modeling through Stochastic Differential Equations, 2020</a></div>

---
clicks: 2
sourceFrame: "extension: 21"
class: theorems
---

# DDIM: From Noise to Clean Data

**Can we change the sampler without retraining the DDPM network?**

**Keep fixed:** $q(\bx_t\mid\bx_0)$ at every noise level — the same noise-MSE training.

**Change:** the joint $q(\bx_{1:T}\mid\bx_0)$ and its transitions, using a non-Markovian forward process.

At each noise level, the forward process gives:

$$
\bx_t=\sqrt{\bar{\alpha}_t}\,\bx_0+\sqrt{1-\bar{\alpha}_t}\,\bepsilon.
$$

<div v-click="1">

Predict the noise with $\bepsilon_{\btheta,t}(\bx_t)$ and solve for the clean data:

$$
\hat{\bx}_0=\frac{\bx_t-\sqrt{1-\bar{\alpha}_t}\,\bepsilon_{\btheta,t}(\bx_t)}{\sqrt{\bar{\alpha}_t}}.
$$

</div>
<div v-click="2">

These two estimates exactly reconstruct the current state:

$$
\bx_t=\sqrt{\bar{\alpha}_t}\,\hat{\bx}_0
+\sqrt{1-\bar{\alpha}_t}\,\bepsilon_{\btheta,t}(\bx_t).
$$

**DDIM idea:** keep both estimates fixed for one transition and change only the weights, from $t$ to $s<t$.

</div>

<div class="source"><a href="https://arxiv.org/abs/2010.02502">Song J., Meng C., Ermon S. Denoising Diffusion Implicit Models, 2021</a></div>

<!--
Bridge from the preceding comparison: similar training objectives can be paired
with different sampling procedures. Ask whether the existing DDPM predictor can
also support a different sampler. This is an explanatory construction, not a new
Training/Sampling overview; the author explicitly requested removing the repeated
Training block and the general stochastic family.

Start with the familiar forward marginal. Replacing the unknown noise by the
network prediction and rearranging gives a clean-data estimate. The network is
called once: it predicts noise, and the clean estimate follows algebraically.
The hat denotes an estimate, not the true clean sample. This is the same identity
as the previously introduced parameterization table, using full coefficients.
The course keeps alpha_t = 1 - beta_t; the DDIM paper's alpha_t is our alpha_bar_t.

Substituting the clean estimate back exactly reconstructs x_t, even with an
imperfect predictor. The last sentence introduces the DDIM choice: keep the two
estimates fixed within one transition and change only their weights to the next
noise level. This new rule is not an algebraic consequence of the marginal alone.
Its formal justification uses non-Markovian forward joints with the same Gaussian
marginals q(x_t | x_0), so the same simple
noise-MSE training objective can be reused. This does not mean that every sampler
is valid, or that all weighted ELBOs and finite-capacity optima coincide. The
paper's variational theorem assumes positive transition noise; deterministic
DDIM is the zero-noise limit. The main slide now states the distinction between
fixed marginals and changed paths; the full variational derivation remains here.
An intuitive zero-noise forward construction uses the same standard Gaussian
epsilon for every level of a given clean example. Every q(x_t | x_0) stays the
same, while the joint path changes. Its transitions can depend on x_0 in addition
to the adjacent state. The generative sampler replaces unknown clean data by an
estimate and recomputes the estimates each step; it is itself a Markov map.
This argument motivates the sampler, not exact finite-step marginal preservation
under a learned predictor. Even an optimal denoiser does not make arbitrary
coarse finite-step updates exact.
-->

---
clicks: 2
sourceFrame: "extension: 21"
class: theorems
---

# DDIM: Same Marginals, Different Transitions

Let $X\sim\cN(0,4)$ and $Z\sim\cN(0,1)$ be independent. Target: $Y\sim\cN(0,1)$.

<div class="columns">
<div class="block" style="margin:0">

## Stochastic transition

$$
Y=\frac{X}{4}+\frac{\sqrt{3}}{2}Z.
$$

Variance: $\displaystyle\frac{4}{16}+\frac{3}{4}=1$.

</div>
<div class="block" style="margin:0" v-click="1">

## Deterministic transition

$$
Y=\frac{X}{2}.\vphantom{\frac{\sqrt{3}}{2}}
$$

Variance: $\displaystyle\frac{4}{4}=1$.

</div>
</div>

<div v-click="2">

**Both give the same distribution of $Y$, but different joint distributions of $(X,Y)$.**

The deterministic transition gets all its randomness from $X$.

Simply deleting $Z$ from the first rule gives $Y=X/4\sim\cN(0,1/4)$: the wrong variance.

</div>

<div class="source">Illustrative Gaussian example.</div>

<!--
Original explanatory example, not a formula copied from the DDIM paper.
Both outputs are zero-mean Gaussian because they are linear combinations of
independent Gaussians; the displayed variances therefore identify their laws.
In the stochastic case, conditional on X=x, Y has mean x/4 and variance 3/4.
In the deterministic case, conditional on X=x, Y=x/2 with zero conditional
variance. Thus the two transitions have exactly the same chosen input/output
marginals but different joints. This is a coupling illustration, not a literal
DDPM/DDIM pair or a proof that finite DDIM steps preserve exact marginals.

The preceding slide concerns marginals conditioned on clean data x_0. In DDIM,
these are kept fixed while changing the joint over noise levels. This toy strips
away that conditioning only to make the distinction between marginal laws and
transitions transparent. Removing the fresh Gaussian term from a transition
without changing its deterministic term generally does not preserve the target
law, as the last sentence demonstrates. Return to the explicit DDIM algorithm
on the next slide: its initial random latent supplies the output variability.
-->

---
clicks: 2
sourceFrame: "extension: 21"
class: theorems
---

# DDIM: Deterministic Sampling

<div class="block">

## Sampling (DDIM)

1. Sample $\bx_T\sim\cN(0,\bI)$; choose a grid $T=t_K>\cdots>t_0=0$.
2. For $k=K,\ldots,1$, set $t=t_k$, $s=t_{k-1}$ and compute:

$$
\begin{aligned}
\hat{\bepsilon}&=\bepsilon_{\btheta,t}(\bx_t)
&&\text{predict noise},\\[8pt]
\hat{\bx}_0&=\frac{\bx_t-\sqrt{1-\bar{\alpha}_t}\,\hat{\bepsilon}}{\sqrt{\bar{\alpha}_t}}
&&\text{estimate clean data},\\[8pt]
\bx_s&={\color{teal}\sqrt{\bar{\alpha}_s}}\,\hat{\bx}_0
+{\color{teal}\sqrt{1-\bar{\alpha}_s}}\,\hat{\bepsilon}
&&\text{update state}.
\end{aligned}
$$

3. Return $\bx_0$.

</div>
<div v-click="1">

**Deterministic limit:** fresh transition noise is zero ($\sigma_{t\to s}=0$); randomness comes from $\bx_T$.

**Original training schedule:** $s<t\Rightarrow\bar{\alpha}_s>\bar{\alpha}_t$: more signal, less noise.

</div>
<div v-click="2">

**Fewer steps:** choose $K\ll T$; $K$ steps require $K$ network evaluations and no retraining.

</div>

<div class="source"><a href="https://arxiv.org/abs/2010.02502">Song J., Meng C., Ermon S. Denoising Diffusion Implicit Models, 2021</a></div>

<!--
The clean-estimate slide motivates the DDIM choice, and the Gaussian example
illustrates why fixed marginal laws allow different transitions. Here the full
sampling loop makes the deterministic rule executable. At iteration k, t=t_k is the current level and s=t_{k-1} is the next
level. The three displayed assignments are ordered: call the noise predictor
once, use its cached output epsilon_hat to compute xhat_0, then compute x_s.
Both estimates are local to this iteration and are recomputed at the next k.
The newly computed x_s is exactly the next iteration's current x_t. At the last
iteration k=1, s=t_0=0. The teal coefficients mark the change from t to s, while
the network is evaluated at the current t and x_t, not at the destination s.
The update is a constructed sampling rule, not just the ancestral DDPM update
with its random term removed: the deterministic coefficients also change.

Sampling still draws a random output: x_T is random and the fixed sequence of
DDIM updates maps that random input to x_0. This is the same source of randomness
as in a normalizing flow or a GAN generator; invertibility is not asserted here.
Think of an ensemble of initial noise samples: deterministic motion can reshape
their distribution without adding new random kicks. DDIM chooses different paths
from stochastic DDPM; it does not reproduce each DDPM reverse conditional by its
mean. A learned denoiser and a finite grid give an approximate generative model.

The visible sigma_{t->s} denotes the standard deviation of fresh transition noise,
not the forward marginal noise level sqrt(1-alpha_bar_s). In the general family,
x_s = sqrt(alpha_bar_s) xhat_0
    + sqrt(1-alpha_bar_s-sigma_{t->s}^2) epsilon_hat + sigma_{t->s} z.
Setting sigma=0 gives exactly the displayed deterministic update. The stochastic
family's interpolation parameter and variance formula remain out of scope.

Indices decrease along the chosen grid. Each selected t is an original training
noise level. alpha_bar_t = product_{i=1}^t (1-beta_i), with alpha_bar_0=1. Keep the
original schedule values at selected indices; do not restart or renumber the
schedule as a new K-step training process. For positive beta, s<t implies
alpha_bar_s>alpha_bar_t: the signal coefficient grows and the noise coefficient
shrinks as sampling moves toward clean data. At every step recompute epsilon_theta,t(x_t) and then xhat_0; neither
estimate is held fixed along the whole trajectory. K counts transitions from
T=t_K to t_0=0. For example, a predictor trained on T=1000 levels may be used on a
50-step subset. Fewer steps save computation but can reduce sampling accuracy;
different grids need not yield identical samples even with the same initial draw.
At s=0, alpha_bar_0=1, so the final update returns that step's clean estimate.
One network evaluation per step refers to the unguided denoiser; ordinary CFG
later uses two denoiser evaluations per step.

The stochastic family and its interpolation parameter are deliberately omitted
from the teaching slides. Later, deterministic DDIM can be connected to the
probability-flow ODE after rescaling x_t/sqrt(alpha_bar_t) and using
sqrt((1-alpha_bar_t)/alpha_bar_t) as the clock. Do not call it exactly the ordinary
Euler step in the original t coordinate or promise exact finite-step inversion.
Transition to guidance: we have changed the sampling rule while reusing the
predictor; next we modify its predictions to steer generation toward a condition.
-->

---
clicks: 0
sourceFrame: "auto: Model Guidance"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>DDPM as a Score-Based Generative Model</div></div>
<div class="outline-item current"><span>02</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 0
sourceFrame: "22"
class: theorems
---

# Guidance

- Up to now, we have focused on **unconditional** generative models $\pt(\bx)$.
- In practice, most generative models are **conditional** (in the diffusion era it is called guided): $\pt(\bx|\by)$.
- Here, $\by$ might denote a class label or **text** (as in text-to-image tasks).

<div class="columns">
<img src="/figs/shedevrum1.jpg" alt="Shedevrum text-conditioned image example 1" style="width:100%;height:280px;object-fit:contain" />
<img src="/figs/shedevrum2.jpg" alt="Shedevrum text-conditioned image example 2" style="width:100%;height:280px;object-fit:contain" />
</div>

---
clicks: 0
sourceFrame: "23"
class: theorems
---

# Conditional Models

In practice, we're typically interested in learning conditional models (sampling from conditional distribution $\pd(\bx|\by)$).

- $\by=\emptyset$, $\bx$ = image $\quad\Rightarrow\quad$ unconditional image model
- $\by$ = class label, $\bx$ = image $\quad\Rightarrow\quad$ class-conditional image model
- $\by$ = text prompt, $\bx$ = image $\quad\Rightarrow\quad$ text-to-image model
- $\by$ = image, $\bx$ = image $\quad\Rightarrow\quad$ image-to-image model
- $\by$ = image, $\bx$ = text $\quad\Rightarrow\quad$ image-to-text (image captioning) model
- $\by$ = English text, $\bx$ = Russian text $\quad\Rightarrow\quad$ sequence-to-sequence model (machine translation)
- $\by$ = sound, $\bx$ = text $\quad\Rightarrow\quad$ speech-to-text (automatic speech recognition) model
- $\by$ = text, $\bx$ = sound $\quad\Rightarrow\quad$ text-to-speech model

---
clicks: 0
sourceFrame: "24"
class: figure-slide
---

# Label Guidance

**Label:** Ostrich (10th ImageNet class)

<img class="hero" src="/figs/label_conditioning.png" alt="Ostrich class-conditional image samples" />

<div class="source"><a href="https://arxiv.org/abs/1906.00446">Razavi A., Oord A., et al. Generating Diverse High-Fidelity Images with VQ-VAE-2, 2019</a></div>

---
clicks: 0
sourceFrame: "25"
class: figure-slide
---

# Text Guidance

**Prompt:** Anna<br>
SDXL fine-tuned on Disney princesses. Same initial noise; only $\gamma$ changes.

<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;margin-top:26px;text-align:center">
<div>

$\gamma=3.5$

<img src="/figs/sdxl-cfg-3.5.png" alt="Anna generated with SDXL and classifier-free guidance scale 3.5" style="width:100%;aspect-ratio:1;object-fit:contain" />
</div>
<div>

$\gamma=4.5$

<img src="/figs/sdxl-cfg-4.5.png" alt="Anna generated from the same initial noise with guidance scale 4.5" style="width:100%;aspect-ratio:1;object-fit:contain" />
</div>
<div>

$\gamma=5.5$

<img src="/figs/sdxl-cfg-5.5.png" alt="Anna generated from the same initial noise with guidance scale 5.5" style="width:100%;aspect-ratio:1;object-fit:contain" />
</div>
<div>

$\gamma=6.5$

<img src="/figs/sdxl-cfg-6.5.png" alt="Anna generated from the same initial noise with guidance scale 6.5" style="width:100%;aspect-ratio:1;object-fit:contain" />
</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2410.03941">Kasymov A., et al. AutoLoRA: AutoGuidance Meets Low-Rank Adaptation for Diffusion Models, 2024. Fig. 3, top row (selected columns).</a> <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0.</a></div>

<!--
Published baseline CFG samples, not the AutoLoRA row: SDXL with Disney Princess
LoRA, fixed LoRA weight 0.7. The source uses w for the CFG scale; here it is gamma
to match the lecture. The caption confirms identical initial noise. This single
seed illustrates changes in appearance, not a measurement of sample diversity.
Author-approved replacement of the former panda illustration from
<a href="https://arxiv.org/abs/2112.10741">Nichol A., et al. GLIDE, 2022</a>.
-->

---
clicks: 6
sourceFrame: "26"
class: theorems
---

# Guidance in Generative Models

<div class="block">

## How to make a guided model?

Instead of sampling from $\pt(\bx)$, we sample from $\pt(\bx|\by)$.

</div>
<div v-click="1">

Given **supervised** data $\{(\bx_i,\by_i)\}_{i=1}^n$, we can treat $\by$ as an additional model input:

</div>
<ul>
<li v-click="2">

$\pt(x_j|\bx_{1:j-1},{\color{olive}\by})$ for AR models;

</li>
<li v-click="3">

Encoder $q_{\bphi}(\bz|\bx,{\color{olive}\by})$ and decoder $\pt(\bx|\bz,{\color{olive}\by})$ for VAEs;

</li>
<li v-click="4">

$G_{\btheta}(\bz,{\color{olive}\by})$ for NFs and GANs;

</li>
<li v-click="5">

$\pt(\bx_{t-1}|\bx_t,{\color{olive}\by})$ for DDPMs.

</li>
</ul>
<div class="block" v-click="6">

## Challenge

- Empirically, images sampled with this procedure do not fit well enough to the desired label $\by$.
- Being able to control the strength of guidance is especially valuable.

</div>

---
clicks: 0
sourceFrame: "auto: Classifier Guidance"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>DDPM as a Score-Based Generative Model</div></div>
<div class="outline-item current"><span>02</span><div>Model Guidance<div class="outline-sub"><b>Classifier Guidance</b><br>Classifier-Free Guidance</div></div></div>

</div>

---
clicks: 3
sourceFrame: "27"
class: theorems
---

# Classifier Guidance

<div class="block">

## DDPM Sampling

1. Sample $\bx_T\sim\cN(0,\bI)$.
2. Denoise the image (unconditional generation):

$$ {1|all} {at:1}
\begin{aligned}
\bx_{t-1}&=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot{\color{teal}\bs_{\btheta,t}(\bx_t)}+\sigma_t\cdot\bepsilon\\
&=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot{\color{teal}\nabla_{\bx_t}\log\pt(\bx_t)}+\sigma_t\cdot\bepsilon
\end{aligned}
$$

</div>
<div class="block" v-click="2">

## Guided Generation

$$
\bx_{t-1}=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot\nabla_{\bx_t}\log\pt(\bx_t|{\color{olive}\by})+\sigma_t\cdot\bepsilon
$$

</div>
<div v-click="3">

What is the link between $\nabla_{\bx_t}\log\pt(\bx_t)$ and $\nabla_{\bx_t}\log\pt(\bx_t|{\color{olive}\by})$?

</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 3
sourceFrame: "28"
class: theorems
---

# Classifier Guidance: Guided Score Function

<div class="block">

## Guided Generation

$$
\bx_{t-1}=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot{\color{olive}\nabla_{\bx_t}\log\pt(\bx_t|\by)}+\sigma_t\cdot\bepsilon
$$

</div>
<div class="block" v-click="1">

## Guided Generation

$$ {1|1-2|all} {at:2}
\begin{aligned}
{\color{olive}\nabla_{\bx_t}\log\pt(\bx_t|\by)}&=\nabla_{\bx_t}\log\left(\frac{\pt(\bx_t)p(\by|\bx_t)}{p(\by)}\right)\\
&={\color{#8854c0}\nabla_{\bx_t}\log\pt(\bx_t)}+\nabla_{\bx_t}\log p(\by|\bx_t)\\
&={\color{#8854c0}\bs_{\btheta,t}(\bx_t)}+{\color{teal}\nabla_{\bx_t}\log p(\by|\bx_t)}={\color{olive}\bs_{\btheta,t}(\bx_t,\by)}
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 0
sourceFrame: "extension: 28"
class: interactive-slide
---

<script setup>
import GuidanceGeometryDemo from './components/GuidanceGeometryDemo.vue'
</script>

# Classifier Guidance: Which Way Does It Push?

Four Gaussian components, two classes, one fixed noise level.

<GuidanceGeometryDemo />

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

<!-- Original analytic toy example. Exact analytic mixture scores. The classifier contribution is gamma times the log-posterior gradient. All three arrows share one display scale, fixed at the current observation across gamma in [0, 7] and both classes. Drag bounds keep vectors in the plot. No particle dynamics or trained network is simulated. PDF fixes the observation, class B and gamma = 3. -->

---
clicks: 3
sourceFrame: "29"
class: theorems
---

# Classifier Guidance: Guidance Scale

<div class="block">

## Guided Score Function

$$
{\color{olive}\bs_{\btheta,t}(\bx_t,\by)}=\bs_{\btheta,t}(\bx_t)+\nabla_{\bx_t}\log p(\by|\bx_t)
$$

</div>
<div v-click="1">

- Let us assume $\by$ is a class label.
- $p(\by|\bx_t)$ is a classifier for noisy inputs.
- $p(\by|\bx_t)$ is responsible for model guidance.

</div>
<div class="block" v-click="2">

## Guidance Scale

It is a natural idea to scale up the contribution of the guidance

$$
{\color{#8854c0}\bs^\gamma_{\btheta,t}(\bx_t,\by)}=\bs_{\btheta,t}(\bx_t)+{\color{teal}\gamma}\cdot\nabla_{\bx_t}\log p(\by|\bx_t)
$$

<div v-click="3">

- The <span style="color:teal">guidance scale $\gamma$</span> adjusts the strength of classifier guidance.
- ${\color{#8854c0}\bs^\gamma_{\btheta,t}(\bx_t,\by)}$ is not the true guided score function ${\color{olive}\bs_{\btheta,t}(\bx_t,\by)}$.

</div>
</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 4
sourceFrame: "30"
class: theorems
---

# Classifier Guidance: Distribution Sharpening

<div class="block">

## Scaled Guided Score Function

$$
{\color{#8854c0}\bs^\gamma_{\btheta,t}(\bx_t,\by)}=\bs_{\btheta,t}(\bx_t)+{\color{teal}\gamma}\cdot\nabla_{\bx_t}\log p(\by|\bx_t)
$$

</div>
<div class="block" v-click="1">

## Scaled Conditional Distribution at a Fixed Noise Level

$$ {1|1-2|all} {at:2}
\begin{aligned}
{\color{#8854c0}\nabla_{\bx_t}^\gamma\log\pt(\bx_t|\by)}&=\nabla_{\bx_t}\log\pt(\bx_t)+{\color{teal}\gamma}\cdot\nabla_{\bx_t}\log p(\by|\bx_t)\\
&=\nabla_{\bx_t}\log\pt(\bx_t)+\nabla_{\bx_t}\log p(\by|\bx_t)^{{\color{teal}\gamma}}\\
&=\nabla_{\bx_t}\log\left(\frac{\pt(\bx_t)p(\by|\bx_t)^\gamma}{Z}\right)
\end{aligned}
$$

</div>
<div v-click="4">

**Note:** Increasing $\gamma$ sharpens $p(\by|\bx_t)$, increasing the contrast

$$
\hat p(\by|\bx_t)\propto p(\by|\bx_t)^\gamma.
$$

Very large $\gamma$ can reduce diversity and introduce artifacts.

</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a><br><a href="https://arxiv.org/abs/2410.02416">Sadat S. et al. Eliminating Oversaturation and Artifacts of High Guidance Scales in Diffusion Models, 2025</a></div>

---
clicks: 0
sourceFrame: "extension: 30"
class: interactive-slide
---

<script setup>
import GuidanceDensityDemo from './components/GuidanceDensityDemo.vue'
</script>

# Guidance Scale Changes the Density

$$
q_\gamma(x_t|y)\propto q(x_t)\,p(y|x_t)^\gamma\qquad\text{at a fixed noise level.}
$$

<GuidanceDensityDemo />

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

<!-- Original analytic toy example. This is a one-dimensional version of the toy, with the same Gaussian component x-means and weights as the preceding geometry. Its classifier uses only the scalar observation. Tilting this marginal is not claimed to equal marginalizing the guided two-dimensional distribution. The normalizing constant is computed numerically on [-5, 5]. This fixed-level identity does not identify the final distribution of the complete guided sampler. PDF shows gamma = 0, 1, 3, 7 for class B. -->

---
clicks: 1
sourceFrame: "31"
class: theorems
---

# Classifier Guidance: Overview

<div class="block">

## Training

1. Train the DDPM as before.
2. Train an additional classifier $p(\by|\bx_t)$ on noisy data (time-dependent).

</div>
<div class="block" v-click="1">

## Sampling (Guided)

1. Sample $\bx_T\sim\cN(0,\bI)$.
2. Denoise with the scaled guided score function:

$$
\bx_{t-1}=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot{\color{olive}\bs^\gamma_{\btheta,t}(\bx_t,\by)}+\sigma_t\cdot\bepsilon.
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2105.05233">Dhariwal P., Nichol A. Diffusion Models Beat GANs on Image Synthesis, 2021</a></div>

---
clicks: 0
sourceFrame: "auto: Classifier-Free Guidance"
---

# Outline

<div class="course-outline">

<div class="outline-item"><span>01</span><div>DDPM as a Score-Based Generative Model</div></div>
<div class="outline-item current"><span>02</span><div>Model Guidance<div class="outline-sub">Classifier Guidance<br><b>Classifier-Free Guidance</b></div></div></div>

</div>

---
clicks: 3
sourceFrame: "32"
class: theorems
---

# Classifier-Free Guidance

- The previous approach relies on training an additional classifier $p(\by|\bx_t)$ for noisy images.
- We now introduce a method to sidestep this requirement.

<div v-click="1">

$$
\nabla_{\bx_t}^\gamma\log\pt(\bx_t|\by)=\nabla_{\bx_t}\log\pt(\bx_t)+\gamma\cdot{\color{teal}\nabla_{\bx_t}\log p(\by|\bx_t)}
$$

</div>
<div class="block" v-click="2">

## Bayes theorem

$$ {1|all} {at:3}
\begin{aligned}
{\color{teal}\nabla_{\bx_t}\log p(\by|\bx_t)}&=\nabla_{\bx_t}\log\left(\frac{\pt(\bx_t|\by)p(\by)}{\pt(\bx_t)}\right)\\
&=\nabla_{\bx_t}\log\pt(\bx_t|\by)-\nabla_{\bx_t}\log\pt(\bx_t)
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a></div>

---
clicks: 2
sourceFrame: "extension: 32"
class: derivation
---

# Classifier-Free Guidance

<div class="block">

## Scaled Guided Score Function

$$ {1|1-2|all} {at:1}
\begin{aligned}
\nabla_{\bx_t}^\gamma\log\pt(\bx_t|\by)&=\nabla_{\bx_t}\log\pt(\bx_t)+\gamma\cdot{\color{teal}\nabla_{\bx_t}\log p(\by|\bx_t)}\\
&=\nabla_{\bx_t}\log\pt(\bx_t)+\gamma\cdot\bigl({\color{teal}\nabla_{\bx_t}\log\pt(\bx_t|\by)-\nabla_{\bx_t}\log\pt(\bx_t)}\bigr)\\
&=(1-\gamma)\cdot\nabla_{\bx_t}\log\pt(\bx_t)+\gamma\cdot\nabla_{\bx_t}\log\pt(\bx_t|\by)
\end{aligned}
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a></div>

---
clicks: 4
sourceFrame: "33"
class: theorems
---

# Classifier-Free Guidance: Formulation

<div class="block">

## Scaled Guided Score Function

$$
\nabla_{\bx_t}^\gamma\log\pt(\bx_t|\by)=(1-\gamma)\cdot\nabla_{\bx_t}\log\pt(\bx_t)+\gamma\cdot\nabla_{\bx_t}\log\pt(\bx_t|\by)
$$

<div v-click="1">

$$
\bs^\gamma_{\btheta,t}(\bx_t,\by)=(1-\gamma)\cdot\bs_{\btheta,t}(\bx_t)+\gamma\cdot\bs_{\btheta,t}(\bx_t,\by)
$$

</div>
</div>
<div class="block" v-click="2">

## Naive training approach

<ul>
<li>

Train an unguided score function model $\bs_{\btheta,t}(\bx_t)$.

</li>
<li>

Train a guided score function model $\bs_{\btheta,t}(\bx_t,\by)$.

</li>
<li v-click="3">Use their affine combination at inference.</li>
</ul>
</div>
<div class="block" v-click="3">

## Sampling (Guided)

$$
\bx_{t-1}=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot{\color{olive}\bs^\gamma_{\btheta,t}(\bx_t,\by)}+\sigma_t\cdot\bepsilon
$$

</div>
<div v-click="4">

How to avoid training two separate score function models?

</div>

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a></div>

---
clicks: 0
sourceFrame: "extension: 33"
class: interactive-slide
---

<script setup>
import CfgExtrapolationDemo from './components/CfgExtrapolationDemo.vue'
</script>

# CFG: Interpolation and Extrapolation

$$
\bs^\gamma_{\btheta,t}=\bs_{\btheta,t}(\bx_t,\varnothing)+\gamma\bigl(\bs_{\btheta,t}(\bx_t,\by)-\bs_{\btheta,t}(\bx_t,\varnothing)\bigr)
$$

<CfgExtrapolationDemo />

<div class="source"><a href="https://arxiv.org/abs/2207.12598">Ho J., Salimans T. Classifier-Free Diffusion Guidance, 2022</a></div>

<!-- Original analytic toy example. Scores are evaluated at one fixed observation of the same analytic two-dimensional toy; vectors use a common fixed display scale. Gamma = 0 selects unconditional, gamma = 1 selects conditional, 0 < gamma < 1 interpolates, gamma > 1 extrapolates. PDF simultaneously shows gamma = 0, 1, 3. This is score-space geometry, not a sampling trajectory. -->

---
clicks: 1
sourceFrame: "34"
class: theorems
---

# Classifier-Free Guidance

$$
\bs^\gamma_{\btheta,t}(\bx_t,\by)=(1-\gamma)\cdot\bs_{\btheta,t}(\bx_t)+\gamma\cdot\bs_{\btheta,t}(\bx_t,\by)
$$

<div class="block">

## CFG

1. Introduce the "absence of conditioning" label $\by=\varnothing$.
2. Identify the unguided score function $\bs_{\btheta,t}(\bx_t)=\bs_{\btheta,t}(\bx_t,\varnothing)$.
3. Train a single model $\bs_{\btheta,t}(\bx_t,\by)$ on **supervised** data, dropping the label $\by$ with some fixed probability (simulating $\by=\varnothing$).
4. At inference, evaluate the model twice to obtain $\bs_{\btheta,t}(\bx_t,\varnothing)$ and $\bs_{\btheta,t}(\bx_t,\by)$.

</div>
<div class="block" v-click="1">

## Sampling (Guided)

$$
\bx_{t-1}=\frac{1}{\sqrt{1-\beta_t}}\cdot\bx_t+\frac{\beta_t}{\sqrt{1-\beta_t}}\cdot{\color{olive}\bs^\gamma_{\btheta,t}(\bx_t,\by)}+\sigma_t\cdot\bepsilon.
$$

</div>

<div class="source"><a href="https://arxiv.org/abs/2506.02070">Holderrieth P., Erives E. An Introduction to Flow Matching and Diffusion Models, 2025</a></div>

---
clicks: 1
sourceFrame: "extension: 34"
class: theorems
---

# Classifier-Free Guidance: Guidance Interval

Apply extra guidance only at intermediate noise levels.

<img src="/figs/guidance-interval-figure2.png" alt="Figure 2 from Kynkäänniemi et al.: the conditional density has two modes; guidance everywhere loses one, while limiting guidance to a noise interval preserves both." style="width:100%;height:310px;object-fit:contain;margin:14px 0" />

<div v-click="1">

**Toy example ($\gamma=6$):** guidance everywhere drops a mode; limiting the interval restores both.

Outside the interval, $\gamma_t=1$: **conditioning remains**. Sampling runs **right to left** ($\sigma\downarrow$).

</div>

<div class="source"><a href="https://arxiv.org/abs/2404.07724">Kynkäänniemi T. et al. Applying Guidance in a Limited Interval Improves Sample and Distribution Quality in Diffusion Models, 2024. Fig. 2.</a></div>

<!--
Figure 2 from PDF v1, page 3: all panels and their original labels are preserved.
The paper uses sigma for the noise level, decreasing during sampling. Panel (a)
shows the unconditional and conditional densities; (b) guides everywhere, losing
one mode; (c) disables guidance at high noise and recovers both modes; (d) also
turns it off at low noise with little effect in this toy example. These interval
endpoints are illustrative, not a universal prescription. Select the interval for
the model and sampler. gamma_t=1 preserves conditional sampling; gamma_t=0 would
instead select the unconditional model in the preceding CFG convention.
-->

---
clicks: 3
sourceFrame: "extension: 34"
class: theorems
---

# Classifier-Free Guidance: Guidance Distillation

Learn the guided prediction in a single model evaluation.

<div style="display:grid;grid-template-columns:1fr 100px 1fr;gap:20px;align-items:center;margin:14px 0">
<div class="block" style="margin:0">

## Teacher: two evaluations

$$
\bs_{\btheta,t}(\bx_t,\varnothing),\quad\bs_{\btheta,t}(\bx_t,\by)
$$

Combine predictions using $\gamma$.

</div>
<div v-click="1" style="text-align:center">

distill

$$
\longrightarrow
$$

</div>
<div class="block" v-click="1" style="margin:0">

## Student: one evaluation

$$
\bs_{\bphi,t}(\bx_t,\by,\gamma)
$$

Pass $\gamma$ as an extra input.

</div>
</div>

<div v-click="1">

$$
\bs_{\bphi,t}(\bx_t,\by,\gamma)\approx
(1-\gamma)\bs_{\btheta,t}(\bx_t,\varnothing)+\gamma\bs_{\btheta,t}(\bx_t,\by)
$$

</div>

<div class="block" v-click="2">

## Training

1. Sample $(\bx_0,\by)\sim\pd$, $t\sim\Uniform\{1,\ldots,T\}$, $\gamma\sim\Uniform[\gamma_{\min},\gamma_{\max}]$.
2. Sample $\bx_t\sim q(\bx_t|\bx_0)$ and compute the **fixed teacher target** $\bs^\gamma_{\btheta,t}(\bx_t,\by)$.
3. Update only $\bphi$ to minimize $\cL=\|\bs_{\bphi,t}(\bx_t,\by,\gamma)-\bs^\gamma_{\btheta,t}(\bx_t,\by)\|_2^2$.

</div>

<div class="block" v-click="3">

## Sampling

1. Evaluate the student once per step; keep the sampler and step count. Used in **FLUX.2 [dev]**.

</div>

<div class="source"><a href="https://arxiv.org/abs/2210.03142">Meng C. et al. On Distillation of Guided Diffusion Models, 2023.</a><br><a href="https://huggingface.co/black-forest-labs/FLUX.2-dev">Black Forest Labs. FLUX.2 [dev] model card: guidance distillation.</a></div>

<!--
This slide covers guidance distillation only: the first stage of Meng et al.,
before their separate progressive distillation of sampling steps. The teacher
parameters theta are fixed; only the student parameters phi are trained. Sample
guidance strengths from a chosen training range; no arbitrary extrapolation claim.
Initialize the student from the teacher and add a guidance-scale embedding
(the paper uses Fourier features, incorporated similarly to the time embedding).
The forward distribution in step 2 is the existing DDPM Gaussian: x_t =
sqrt(alpha_bar_t) x_0 + sqrt(1-alpha_bar_t) epsilon, epsilon ~ N(0, I).
The teacher target is a constant for the update: theta is frozen and only phi is optimized.
The displayed score MSE is a simple version of the matching objective. The paper
uses time-weighted x_0 regression; translating that exact objective to score
space additionally rescales each squared error by a time-dependent weight.
We illustrate the teacher/student matching principle, not its exact weighting.
Its guidance
convention is conditional + w * (conditional - unconditional), so gamma = 1 + w.
The two teacher predictions can be batched, but still require two denoiser
evaluations. The model card confirms FLUX.2 [dev] uses guidance distillation;
this does not assert that its proprietary training recipe is identical to Meng's.
-->

---
clicks: 0
sourceFrame: "35"
class: summary
---

# Summary

- DDPM and NCSN are intimately connected at the objective level.
- DDPM and NCSN use different samplers; DDIM reuses the DDPM network on a shorter sampling grid.
- Guidance makes generation controllable through labels or text prompts.
- Classifier guidance turns an unconditional model into a conditional one by training an auxiliary classifier on noisy data.
- Classifier-free guidance needs no auxiliary classifier; guidance intervals can improve its quality-diversity trade-off, and distillation reduces evaluations per step.
