import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import firebase_app from "~/utils/firebase";
import { setDoc, doc, getFirestore } from "firebase/firestore";

export const loggerRouter = createTRPCRouter({
  log: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      const { message } = input;
      const db = getFirestore(firebase_app);
      await setDoc(doc(db, "logs", Date.now().toString()), {
        message,
        timestamp: Date.now(),
      });
      return { message };
    }),
});
