import crypto from "crypto";
import { loadLinks, saveLinks, getLinkByShortCode } from "../models/shortner.model.js";

export const postUrlShortner = async (req, res) => {
  try {
    const { url, shortCode } = req.body;
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

    const links = await loadLinks();

    if (links[finalShortCode]) {
      return res
        .status(400)
        .send("Short code already exists. Please choose another.");
    }

    // Validate URL (basic check)
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).send("Invalid URL.");
    }

    // links[finalShortCode] = url; // Use finalShortCode instead of shortCode
    // await saveLinks(links);

    await saveLinks({ url, shortCode });

    return res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

export const getShortnerPage = async (req, res) => {
  try {
    // const file = await fs.readFile(path.join("views", "index.html"));
    const links = await loadLinks();

    return res.render("index", { links, host: req.host });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

export const redirectToShortLinks = async (req, res) => {
  try {
    const { shortCode } = req.params;
    // const links = await loadLinks();
    const link = await getLinkByShortCode(shortCode);
    
    // if (!links[shortCode]) return res.status(404).send("404 error occurred");
    if (!link) return res.redirect("/404");
    return res.redirect(link.url);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};
