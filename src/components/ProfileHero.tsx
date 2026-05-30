"use client";

import { ArrowRight } from 'lucide-react';

export default function ProfileHero() {
  return (
    <section className="profile-hero" id="profile">
      <div className="profile-hero__copy">
        <p className="profile-hero__eyebrow">AI Agent UI Designer</p>
        <h2 className="profile-hero__name">刘安烨</h2>
        <h3 className="profile-hero__title">
          Designing interfaces for AI Agent products.
        </h3>
        <p className="profile-hero__meta">
          东北农业大学｜双一流｜211 · 设计学背景，辅修计算机科学
        </p>
        <p className="profile-hero__value">
          擅长把 AI 项目从概念、逻辑、视觉到前端原型完整设计出来。
        </p>
        <div className="profile-hero__actions">
          <button
            onClick={() => document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' })}
            className="profile-hero__btn profile-hero__btn--primary"
          >
            View Works <ArrowRight size={16} />
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="profile-hero__btn profile-hero__btn--secondary"
          >
            Contact
          </button>
        </div>
      </div>

      <div className="profile-hero__portrait" aria-hidden>
        <img src="/home-portrait-bg.jpg" alt="" />
      </div>
    </section>
  );
}
