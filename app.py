from flask import Flask, redirect, render_template, url_for


PROJECTS = (
    {"title": "Porta", "category": "LLM INFRASTRUCTURE", "summary": "An LLM gateway that keeps AI applications running when a provider fails.", "detail": "Built automatic OpenAI-to-Ollama fallback routing and caching, sustaining 93% success during primary-provider failure. Added dashboards for token usage and fallback rates.", "technologies": "FastAPI / Ollama / Redis / Kubernetes / Prometheus"},
    {"title": "PreParty Live", "category": "REAL-TIME SYSTEMS", "summary": "A pre-event engagement app with live chat and interactive activities.", "detail": "Connected SwiftUI clients to a Go backend over WebSockets. Deployed on AWS ECS with PostgreSQL RDS, S3, and CloudFront for storage and media delivery.", "technologies": "SwiftUI / Go / WebSockets / PostgreSQL / AWS"},
    {"title": "Adversarial Text Generator", "category": "APPLIED MACHINE LEARNING", "summary": "A fine-tuning pipeline for testing the limits of text classifiers.", "detail": "Fine-tuned Llama 3.2 1B with QLoRA on HateXplain. Built a six-metric evaluation suite covering toxicity, diversity, fluency, attack success, control accuracy, and LLM-as-judge.", "technologies": "Python / PyTorch / Hugging Face / PEFT / QLoRA"},
)
EXPERIENCE = (
    {"organization": "SJSU Computer Science Systems Group", "role": "Undergraduate Research Assistant", "date": "AUG 2026 - PRESENT", "description": "Researching secure data exchange, replay protection, and data freshness in distributed Android systems with 10+ researchers."},
    {"organization": "Software & Computer Engineering Society", "role": "Development Team Officer", "date": "JAN 2025 - PRESENT", "description": "Built GitOps deployment pipelines and Prometheus monitoring for 15+ services and 3,000+ users; cut deployment time by 80%."},
    {"organization": "SJSU College of Engineering", "role": "Software Engineering Intern", "date": "MAY 2026 - AUG 2026", "description": "Built an Express.js API for YouTube playback on Raspberry Pi speakers, with retries and Docker, Prometheus, and Grafana monitoring."},
    {"organization": "Spartan Racing", "role": "Software Engineering Intern", "date": "AUG 2025 - MAY 2026", "description": "Built pytest simulations for VCU algorithms, automated with GitHub Actions; added hardware-in-the-loop checks for ECU timing and CAN bus."},
)


def create_app() -> Flask:
    # Vercel serves files under public/ directly from its CDN. Keeping the
    # Flask static endpoint pointed at public/static also preserves local URLs.
    app = Flask(__name__, static_folder="public/static")

    @app.get("/")
    def home() -> str:
        return render_template("index.html")

    @app.get("/projects")
    def projects() -> str:
        return render_template("projects.html", projects=PROJECTS)

    @app.get("/project")
    def project_alias() -> str:
        return redirect(url_for("projects"))

    @app.get("/experience")
    def experience() -> str:
        return render_template("experience.html", experience=EXPERIENCE)

    @app.get("/about")
    def about() -> str:
        return render_template("about.html")

    @app.get("/contact")
    def contact() -> str:
        return render_template("contact.html")

    return app


app = create_app()
