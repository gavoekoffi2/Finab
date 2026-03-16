import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const REVIEWS_FILE = path.join(process.cwd(), "data", "reviews.json");

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  approved: boolean;
}

function getReviews(): Review[] {
  try {
    if (!fs.existsSync(path.dirname(REVIEWS_FILE))) {
      fs.mkdirSync(path.dirname(REVIEWS_FILE), { recursive: true });
    }
    if (!fs.existsSync(REVIEWS_FILE)) {
      // Avis initiaux de démonstration
      const initial: Review[] = [
        {
          id: "1",
          name: "Marie-Claire D.",
          location: "Montréal, Canada",
          rating: 5,
          text: "Grâce à FINAB, j'ai enfin compris comment gérer mes finances et optimiser mes impôts. Le service est professionnel et l'équipe est très à l'écoute.",
          date: "2025-11-15",
          approved: true,
        },
        {
          id: "2",
          name: "Jean-Baptiste K.",
          location: "Lomé, Togo",
          rating: 5,
          text: "L'assurance santé de FINAB m'a permis de couvrir toute ma famille à un prix abordable. Je recommande vivement leurs services en Afrique.",
          date: "2025-12-03",
          approved: true,
        },
        {
          id: "3",
          name: "Sophie L.",
          location: "Port-au-Prince, Haïti",
          rating: 5,
          text: "Le processus de déclaration d'impôts a été simplifié grâce à leur accompagnement. Très satisfaite du résultat et du professionnalisme.",
          date: "2026-01-10",
          approved: true,
        },
        {
          id: "4",
          name: "Amadou S.",
          location: "Abidjan, Côte d'Ivoire",
          rating: 4,
          text: "FINAB m'a aidé à trouver une formation adaptée et un emploi au Canada. Un vrai tremplin pour ma carrière internationale.",
          date: "2026-02-08",
          approved: true,
        },
        {
          id: "5",
          name: "Fatou N.",
          location: "Dakar, Sénégal",
          rating: 5,
          text: "Une équipe exceptionnelle qui comprend vraiment nos besoins. Leur programme d'éducation financière a changé ma façon de gérer mon argent.",
          date: "2026-02-20",
          approved: true,
        },
      ];
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const data = fs.readFileSync(REVIEWS_FILE, "utf-8");
    return JSON.parse(data) as Review[];
  } catch {
    return [];
  }
}

function saveReviews(reviews: Review[]): void {
  if (!fs.existsSync(path.dirname(REVIEWS_FILE))) {
    fs.mkdirSync(path.dirname(REVIEWS_FILE), { recursive: true });
  }
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
}

export async function GET() {
  const reviews = getReviews().filter((r) => r.approved);
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, location, rating, text } = body;

    if (!name || !rating || !text) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Note invalide" }, { status: 400 });
    }

    if (text.length < 10 || text.length > 500) {
      return NextResponse.json(
        { error: "Le commentaire doit contenir entre 10 et 500 caractères" },
        { status: 400 }
      );
    }

    const reviews = getReviews();
    const newReview: Review = {
      id: Date.now().toString(),
      name: name.trim().substring(0, 60),
      location: (location || "").trim().substring(0, 60),
      rating,
      text: text.trim().substring(0, 500),
      date: new Date().toISOString().split("T")[0],
      approved: true, // Auto-approuvé — changer à false pour modération
    };

    reviews.push(newReview);
    saveReviews(reviews);

    return NextResponse.json({ success: true, review: newReview });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
