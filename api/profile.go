package handler

import (
	"encoding/json"
	"net/http"
)

type Skill struct {
	Name  string `json:"name"`
	Level string `json:"level"`
}

type Experience struct {
	Company string `json:"company"`
	Role    string `json:"role"`
	Period  string `json:"period"`
	Summary string `json:"summary"`
}

type Project struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Tech        []string `json:"tech"`
	URL         string   `json:"url,omitempty"`
}

type ProfileResponse struct {
	Name       string       `json:"name"`
	Title      string       `json:"title"`
	Bio        string       `json:"bio"`
	Skills     []Skill      `json:"skills"`
	Experience []Experience `json:"experience"`
	Projects   []Project    `json:"projects"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	profile := ProfileResponse{
		Name:  "Bianca Dulam",
		Title: "Fullstack Developer",
		Bio:   "Fullstack developer passionate about building fast, elegant web applications.",
		Skills: []Skill{
			{Name: "TypeScript", Level: "expert"},
			{Name: "React / Next.js", Level: "expert"},
			{Name: "Go", Level: "intermediate"},
			{Name: "Python", Level: "intermediate"},
			{Name: "Rust", Level: "learning"},
			{Name: "PostgreSQL", Level: "intermediate"},
		},
		Experience: []Experience{
			{
				Company: "Acme Corp",
				Role:    "Senior Fullstack Engineer",
				Period:  "2022 – present",
				Summary: "Led development of customer-facing products serving 100k+ users.",
			},
		},
		Projects: []Project{
			{
				Name:        "Portfolio",
				Description: "Personal portfolio built with Next.js, Tailwind, and polyglot Vercel functions.",
				Tech:        []string{"Next.js", "TypeScript", "Go", "Python", "Rust"},
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(profile)
}
