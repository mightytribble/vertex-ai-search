# vertex-ai-search
A simple SillyTavern extension that enables the vertex-ai-search tool for full service Vertex AI connections.

In other words, it lets your current Gemini model (Flash or Pro 2.5 or Pro 3.0) use the retrieval tool to query a Vertex AI Search datastore. It's mostly just a proof-of-concept but could still be useful to someone.

Requires SillyTavern 1.14+ to work (which at the moment means the Staging branch). And a Vertex AI Search datastore.

With this extension enabled you'll still need to adjust your prompting to tell the model when to use the tool (i.e., what kind of data is in there?).
