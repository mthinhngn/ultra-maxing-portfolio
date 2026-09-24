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
TERMINAL_COMMANDS = (
    {"command": "help", "label": "Command index", "aliases": ("commands",), "description": "peek at the command lineup"},
    {"command": "experience", "label": "Experience", "aliases": ("work experience",), "description": "where I put my skills to work"},
    {"command": "projects", "label": "Projects", "aliases": ("project", "selected projects", "my projects"), "description": "take a look at things I've built"},
    {"command": "skills", "label": "Skills", "aliases": ("toolkit",), "description": "the tech in my toolbox"},
    {"command": "whoami", "label": "Who am I", "aliases": ("about me",), "description": "meet the human behind the keyboard"},
    {"command": "contact", "label": "Contact", "aliases": ("get in touch",), "description": "drop me a hello"},
    {"command": "clear", "label": "Clear conversation", "aliases": (), "description": "wipe the slate and start fresh"},
)

SKILL_GROUPS = (
    {"key": "languages", "label": "Languages", "skills": ("Python", "Java", "C++", "JavaScript/TypeScript", "HTML/CSS", "Bash", "Go (Golang)")},
    {"key": "frameworks", "label": "Frameworks", "skills": ("React", "FastAPI", "Node.js", "Next.js", "Express.js", "Flask", "JUnit")},
    {"key": "databases", "label": "Databases & Storage", "skills": ("Postgres", "MongoDB", "Oracle", "Redis", "S3")},
    {"key": "infrastructure", "label": "Infra & Tools", "skills": ("Docker", "Kubernetes", "Terraform", "Linux", "GCP", "Git", "AWS", "CI/CD", "Prometheus", "Grafana")},
)


def create_app() -> Flask:
    # Vercel serves files under public/ directly from its CDN. Keeping the
    # Flask static endpoint pointed at public/static also preserves local URLs.
    app = Flask(__name__, static_folder="public/static")

    @app.get("/")
    def home() -> str:
        return render_template(
            "index.html",
            projects=PROJECTS,
            experience=EXPERIENCE,
            terminal_commands=TERMINAL_COMMANDS,
            terminal_command_options=TERMINAL_COMMANDS,
            skill_groups=SKILL_GROUPS,
        )

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

    @app.get("/resume")
    def resume() -> str:
        resume_url = url_for("static", filename="documents/ThinhNguyenResume2027.pdf")
        return render_template("resume.html", resume_url=resume_url)

    return app


app = create_app()
