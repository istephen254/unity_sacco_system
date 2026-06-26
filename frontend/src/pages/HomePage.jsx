import React from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="home">
      {/* NAV */}
      <nav className="home-nav">
        <div className="home-nav__brand">
          <span className="home-nav__stamp">US</span>
          <span className="home-nav__name">Unity SACCO</span>
        </div>
        <button className="home-nav__login" onClick={() => navigate('/login')}>
          Member Login
        </button>
      </nav>

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">Est. 2024 · Nairobi, Kenya</p>
          <h1 className="home-hero__title">
            Banking built on<br />
            <em>trust &amp; community</em>
          </h1>
          <p className="home-hero__sub">
            Save together, grow together. Unity SACCO empowers members with
            transparent savings, affordable loans, and real-time account access.
          </p>
          <div className="home-hero__actions">
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Access Your Account
            </button>
            <a className="btn-ghost" href="#about">Learn More</a>
          </div>
        </div>
        <div className="home-hero__visual">
          <div className="passbook">
            <div className="passbook__header">Member Passbook</div>
            <div className="passbook__row">
              <span>Savings Balance</span>
              <strong>KES 124,500</strong>
            </div>
            <div className="passbook__row">
              <span>Loan Balance</span>
              <strong>KES 45,000</strong>
            </div>
            <div className="passbook__row">
              <span>Shares</span>
              <strong>250 units</strong>
            </div>
            <div className="passbook__stamp">UNITY<br/>SACCO</div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="home-stats">
        <div className="home-stats__item">
          <span className="home-stats__number">2,400+</span>
          <span className="home-stats__label">Active Members</span>
        </div>
        <div className="home-stats__item">
          <span className="home-stats__number">KES 180M</span>
          <span className="home-stats__label">Total Savings</span>
        </div>
        <div className="home-stats__item">
          <span className="home-stats__number">98%</span>
          <span className="home-stats__label">Loan Repayment Rate</span>
        </div>
        <div className="home-stats__item">
          <span className="home-stats__number">12%</span>
          <span className="home-stats__label">Annual Dividend</span>
        </div>
      </section>

      {/* ABOUT */}
      <section className="home-about" id="about">
        <h2 className="home-about__title">Why Unity SACCO?</h2>
        <div className="home-about__grid">
          <div className="home-about__card">
            <div className="home-about__icon">💰</div>
            <h3>Competitive Savings</h3>
            <p>Earn higher interest on your deposits than traditional banks, with monthly compounding.</p>
          </div>
          <div className="home-about__card">
            <div className="home-about__icon">🤝</div>
            <h3>Affordable Loans</h3>
            <p>Access credit at low interest rates with flexible repayment — backed by fellow members.</p>
          </div>
          <div className="home-about__card">
            <div className="home-about__icon">📊</div>
            <h3>Full Transparency</h3>
            <p>Track every transaction, download statements, and view your loan schedule in real time.</p>
          </div>
          <div className="home-about__card">
            <div className="home-about__icon">🔒</div>
            <h3>Secure & Regulated</h3>
            <p>Licensed and supervised under the SACCO Societies Regulatory Authority (SASRA).</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <span>© {new Date().getFullYear()} Unity SACCO · Nairobi, Kenya</span>
        <span>Regulated by SASRA</span>
      </footer>
    </div>
  )
}