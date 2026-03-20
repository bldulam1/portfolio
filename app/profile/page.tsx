import clsx from "clsx";

const projects = [
  {
    title: "Smart Order Router GUI",
    company: "FinStadiumX",
    period: "2024 – Present",
    description:
      "Real-time admin dashboard for a financial Smart Order Router. Subscribes to FIX protocol messages directly from the engine and renders live trade statistics and order flow to the frontend with minimal latency.",
    stack: ["Go", "TypeScript", "React", "WebSocket", "FIX Protocol"],
  },
  {
    title: "Fractional Trading OMS",
    company: "FinStadiumX",
    period: "2024 – Present",
    description:
      "Order Management System for fractional securities trading, built for a Japanese securities firm. A symbol-based router distributes orders across multiple matching engines running on separate machines, ensuring optimal execution and horizontal scalability.",
    stack: ["Go", "PostgreSQL", "MariaDB", "Docker"],
  },
  {
    title: "Business Intelligence Bot",
    company: "Nomura Securities",
    period: "2023 – 2024",
    description:
      "AI assistant for sales traders and managers at Nomura. Uses KDB/Q as a high-performance vector store to retrieve earnings reports, analyst ratings, and live market data. Built RAG pipelines to extract and structure financial data from databases, PDFs, and HTML, then surface it through an LLM-driven conversational interface.",
    stack: ["Python", "KDB/Q", "React", "LLM", "RAG"],
  },
  {
    title: "Nomura CrossFinder",
    company: "Nomura Securities",
    period: "2020 – 2024",
    description:
      "Enhanced the liquidity discovery algorithm on Nomura's dark pool matching platform. Optimized KDB/Q queries for faster matching logic, upgraded notifications from polling to WebSocket, and improved Python scripts and SQL for client-facing PDF reports.",
    stack: ["KDB/Q", "Python", "React", "WebSocket", "SQL"],
  },
  {
    title: "Circle — Investor CRM",
    company: "Nomura Securities",
    period: "2021 – 2022",
    description:
      "CRM for the Sales and Marketing team to manage investor events, automate emails, and track participation. Deployed to production in six months — supporting 300+ internal users and 10,000+ investors across Japan, APAC, and Europe.",
    stack: ["React", "Node.js", "GraphQL", "MySQL", "TypeScript"],
  },
  {
    title: "Clarity — Sensor Data Platform",
    company: "Veoneer Japan",
    period: "2018 – 2020",
    description:
      "Data management tool for vehicle sensor recordings used in autonomous vehicle development. Validated data integrity via MD5 hashing, built metadata search, and developed a Lidar Point Cloud visualization tool using XVIZ and Streetscape.gl.",
    stack: ["React", "Python", "Go", "Streetscape.gl", "XVIZ"],
  },
];

const experience = [
  {
    company: "FinStadiumX",
    role: "Lead Frontend Engineer",
    period: "Jun 2024 – Present",
    highlights: [
      "Leading the Admin GUI for a Smart Order Router — streaming FIX messages live to the frontend",
      "Designed a Fractional Trading OMS with a multi-engine symbol router for a Japanese securities firm",
      "Built an automated Invoicing System with PDF generation and email dispatch, deployed on AWS Amplify",
    ],
  },
  {
    company: "Nomura Securities Co. Ltd",
    role: "Fullstack Engineer",
    period: "Aug 2020 – Jun 2024",
    highlights: [
      "Built a fullstack AI assistant for traders using KDB/Q as a vector store and RAG pipelines over financial data",
      "Optimized the CrossFinder dark pool algorithm and upgraded its notification system to WebSockets",
      "Developed Circle — a CRM serving 300+ internal users and 10,000+ investors across Japan and APAC",
      "Built real-time order book streaming from the Tokyo Stock Exchange into an internal BI platform",
    ],
  },
  {
    company: "Veoneer Japan",
    role: "Software Engineer",
    period: "Aug 2018 – Jul 2020",
    highlights: [
      "Built Clarity — a sensor data management tool for autonomous vehicle radar and camera validation",
      "Developed a Go-based PCAP decoder for Velodyne Lidar data, converting point clouds to CSV/JSON",
    ],
  },
  {
    company: "KOTO Electric Co., Ltd",
    role: "Embedded Software Engineer",
    period: "Oct 2017 – Jul 2018",
    highlights: [
      "Developed an ESP32-based firmware system to drive LED dot matrix panels for trains and marine vessels",
      "Built a web interface for remote control of panel content, with a 16×16 pixel UTF-8 character dictionary",
    ],
  },
  {
    company: "Rokko & Associates",
    role: "Software Developer",
    period: "Jul 2015 – Oct 2017",
    highlights: [
      "Automated quality inspection reports for a 35-story building using VBA — supporting multiple electrician teams",
      "Built AutoCAD scripting tools to automate frequently used drafting commands",
    ],
  },
];

export default function Profile() {
  return (
    <main className="container grid grid-cols-1 px-4 py-10 mx-auto md:grid-cols-5">
      {/* Sidebar */}
      <section className="md:col-span-2">
        <div className="md:fixed">
          <h1
            className={clsx(
              "mb-1 text-3xl font-semibold text-transparent",
              "bg-gradient-to-l from-amber-200 to-amber-400 bg-clip-text",
            )}
          >
            brendon dulam
          </h1>
          <h3 className="text-xl text-gray-300">Fullstack Developer</h3>
          <p className="mt-1 text-xs tracking-widest uppercase text-gray-600">
            Fintech · Real-Time Systems · AI Tooling
          </p>

          <div className="mt-6 flex flex-col gap-1 text-sm text-gray-500">
            <span>📍 Japan</span>
            <a
              href="https://linkedin.com/in/bldulam1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors"
            >
              linkedin.com/in/bldulam1
            </a>
          </div>

          <a
            href="mailto:brendondulam06@gmail.com"
            className="inline-block px-3 py-1 mt-6 border rounded cursor-pointer border-amber-200 text-amber-300 text-sm hover:bg-amber-200 hover:text-black transition-colors"
          >
            Contact Me
          </a>
        </div>
      </section>

      {/* Main content */}
      <section className="grid gap-12 py-10 md:col-span-3 md:py-0">

        {/* Introduction */}
        <div>
          <h6 className="mb-4 text-xl font-semibold text-amber-200">Introduction</h6>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              I build systems where correctness is non-negotiable and latency is measured in milliseconds.
            </p>
            <p>
              My path started at the circuit level — writing firmware for embedded systems, driving LED
              dot matrix panels on trains, automating quality inspections for a 35-story building. That
              foundation built an instinct most engineers who live in the cloud don&apos;t develop: the
              discipline to think in bytes, cycles, and physical constraints.
            </p>
            <p>
              At Veoneer, I moved to sensor data — processing lidar and camera recordings from autonomous
              vehicles, building the tools that validated whether a self-driving system perceived the world
              accurately. At Nomura Securities, I entered financial infrastructure: optimizing dark pool
              liquidity algorithms, streaming live order book data from the Tokyo Stock Exchange, and
              building an AI assistant that let traders query earnings reports and market data in natural
              language.
            </p>
            <p>
              Now at FinStadiumX, I&apos;m at the sharpest edge of real-time systems — designing the
              admin interface for a Smart Order Router, subscribing to FIX protocol messages live from
              the engine, and building order management systems for fractional trading across multiple
              matching engines.
            </p>
            <p>
              Three strands — hardware, data, finance — converged into one discipline: engineering
              systems that have to work, under load, where failure has consequences.
            </p>
          </div>
        </div>

        {/* Projects */}
        <div>
          <h6 className="mb-4 text-xl font-semibold text-amber-200">Key Projects</h6>
          <div className="grid gap-5">
            {projects.map((project) => (
              <div
                key={project.title}
                className="p-4 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-gray-200">{project.title}</span>
                  <span className="text-xs text-gray-600 whitespace-nowrap">{project.period}</span>
                </div>
                <span className="text-xs text-amber-400 mb-2 block">{project.company}</span>
                <p className="text-sm text-gray-400 leading-relaxed mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-xs bg-gray-900 border border-gray-700 rounded text-gray-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Experience */}
        <div>
          <h6 className="mb-4 text-xl font-semibold text-amber-200">Work Experience</h6>
          <div className="grid gap-8">
            {experience.map((job) => (
              <div key={job.company} className="relative pl-4 border-l border-gray-800">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-amber-400" />
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <span className="font-semibold text-gray-200">{job.company}</span>
                  <span className="text-xs text-gray-600 whitespace-nowrap">{job.period}</span>
                </div>
                <span className="text-sm text-amber-400 mb-2 block">{job.role}</span>
                <ul className="space-y-1">
                  {job.highlights.map((h) => (
                    <li key={h} className="text-sm text-gray-400 flex gap-2">
                      <span className="text-gray-700 mt-1">—</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Certifications */}
        <div>
          <h6 className="mb-4 text-xl font-semibold text-amber-200">Education & Certifications</h6>
          <div className="mb-5 pl-4 border-l border-gray-800 relative">
            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-amber-400" />
            <p className="font-semibold text-gray-200">University of the Philippines Diliman</p>
            <p className="text-sm text-amber-400">BS Electronics and Communications Engineering</p>
            <p className="text-sm text-gray-500">Graduated Cum Laude</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "AWS Certified Developer Associate",
              "JSDA Class 1 Sales Representative",
              "JSDA Internal Administrator",
              "Trading Algorithms (Coursera)",
              "Advanced Trading Algorithms (Coursera)",
              "Reinforcement Learning for Trading",
              "Transaction Cost Analysis with PyKX",
            ].map((cert) => (
              <span
                key={cert}
                className="px-2 py-1 text-xs bg-gray-900 border border-gray-800 rounded text-gray-400"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}
