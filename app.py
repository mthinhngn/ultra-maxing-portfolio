from flask import Flask, redirect, render_template, url_for


PROJECTS = (
    {
        "title": "Porta",
        "category": "LLM INFRASTRUCTURE",
        "technologies": ("FastAPI", "OpenAI", "Ollama", "Redis", "Docker", "Kubernetes", "Helm", "Prometheus", "Grafana"),
        "bullets": (
            "Built an LLM gateway with automatic failover and caching to keep AI apps running across providers and cut costs",
            "Designed OpenAI to Ollama fallback routing across Llama and Qwen, sustaining 93% success on primary failure",
            "Implemented Prometheus metrics and Grafana dashboards for token usage and fallback request rates",
        ),
    },
    {
        "title": "PreParty Live",
        "category": "REAL-TIME SYSTEMS",
        "technologies": ("SwiftUI", "Go", "WebSockets", "PostgreSQL", "AWS RDS", "S3", "CloudFront"),
        "bullets": (
            "Developed a real-time pre-event engagement app with SwiftUI and Go, enabling live chat and interactive activities",
            "Implemented WebSockets for low-latency, bidirectional messaging between SwiftUI clients and the Go backend",
            "Deployed on AWS ECS with PostgreSQL RDS, S3, and CloudFront for scalable storage and media delivery",
        ),
    },
    {
        "title": "Adversarial Text Generator",
        "category": "APPLIED MACHINE LEARNING",
        "technologies": ("Python", "Hugging Face", "PyTorch", "PEFT", "QLoRA", "TRL"),
        "bullets": (
            "Fine-tuned Llama 3.2 1B with QLoRA on HateXplain, generating adversarial text for classifier training",
            "Built a six-metric suite evaluating toxicity, diversity, fluency, attack success, control accuracy, and LLM-as-judge",
            "Developed a Hugging Face and PyTorch pipeline for Colab training, ablation studies, and decoding analysis",
        ),
    },
)
EXPERIENCE = (
    {
        "role": "Undergraduate Research Assistant",
        "organization": "SJSU Computer Science Systems Group",
        "dates": "AUG 2026 - PRESENT",
        "description": "Collaborating on the open-source Disconnected Data Distribution (discd.net) project, which provides internet services to disconnected areas through mobile Android infrastructure.",
    },
    {
        "role": "Development Team Officer",
        "organization": "Software & Computer Engineering Society",
        "dates": "JAN 2025 - PRESENT",
        "description": "Built GitOps deployment pipelines and Prometheus monitoring for 15+ services and 3,000+ users; cut deployment time by 80%.",
    },
    {
        "role": "Software Engineering Intern",
        "organization": "SJSU College of Engineering",
        "dates": "MAY 2026 - AUG 2026",
        "description": "Built an Express.js API for YouTube playback on Raspberry Pi speakers, with retries and Docker, Prometheus, and Grafana monitoring.",
    },
    {
        "role": "Software Engineering Intern",
        "organization": "Spartan Racing",
        "dates": "AUG 2025 - MAY 2026",
        "description": "Built a software-in-the-loop (SIL) testing framework using PyTest and mock I/O drivers to automatically validate Vehicle Control Unit (VCU) software algorithms.",
    },
)
TERMINAL_COMMANDS = (
    {"command": "help", "label": "Command index", "aliases": ("commands",), "description": "peek at the command lineup"},
    {"command": "experiences", "label": "Experience", "aliases": ("experience", "work experience"), "description": "where I put my skills to work"},
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

    @app.get("/experiences", endpoint="experiences")
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
