import { doc, getFirestore, setDoc } from "firebase/firestore";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import firebase_app from "~/utils/firebase";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const input = z.object({ message: z.string() }).parse(req.body);

        const { message } = input;
        const db = getFirestore(firebase_app);
        await setDoc(doc(db, "logs", Date.now().toString()), {
          message,
          timestamp: Date.now(),
        });
        res.status(201).json({ message });
        return;
      } catch (error: any) {
        if (error.name === "ZodError") {
          res.status(400).json({ error: error.issues });
          return;
        }
        res.status(500).json({ error });
      }
      break;
  }
  res.status(405).json({ error: "Method not implemented" });
}
