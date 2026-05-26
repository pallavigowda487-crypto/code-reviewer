import streamlit as st
import os
import json
from groq import Groq

# Configure the page
st.set_page_config(
    page_title="Automated Code Reviewer",
    page_icon="💻",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Header
st.title("💻 Automated Code Reviewer")
st.markdown("Harness the power of AI to detect bugs, vulnerabilities, and optimize your code instantly.")

# API Key handling
api_key = os.environ.get("GROQ_API_KEY")
if not api_key:
    # Try fetching from Streamlit secrets if deployed
    try:
        api_key = st.secrets["GROQ_API_KEY"]
    except (FileNotFoundError, KeyError):
        api_key = None

if not api_key:
    st.sidebar.warning("GROQ_API_KEY is not set. A mock review will be shown for demonstration purposes.")
    st.sidebar.info("To use live AI, set the GROQ_API_KEY in Streamlit Secrets or as an environment variable.")

# Layout
col1, col2 = st.columns([1, 1])

with col1:
    st.subheader("Input Code")
    language = st.selectbox(
        "Select Language",
        ["JavaScript", "TypeScript", "Python", "Java", "C", "C++", "Go"]
    )
    code = st.text_area("Paste your code here:", height=400, placeholder="// Paste your code here\n")
    
    if st.button("Review Code", type="primary", use_container_width=True):
        if not code or code.strip() == "" or code.strip() == "// Paste your code here":
            st.error("Please provide some code to review.")
        else:
            with st.spinner("Reviewing your code..."):
                if api_key:
                    # Live API Call
                    try:
                        client = Groq(api_key=api_key)
                        
                        system_prompt = """You are an expert AI code reviewer. Your task is to analyze the provided code and return a JSON object containing the review results.
Your response MUST be valid, parseable JSON and nothing else. Do not wrap it in markdown block quotes.

The JSON object must follow this exact structure:
{
  "summary": "A brief overall summary of the code quality and purpose.",
  "score": 85, // A number out of 100 representing code quality
  "issues": [
    {
      "severity": "High|Medium|Low",
      "line": "Line number or range",
      "problem": "Description of the problem",
      "solution": "How to fix it"
    }
  ],
  "improvedCode": "The fully corrected and improved version of the code.",
  "bestPractices": ["An array", "of best practices", "relevant to this code"]
}"""
                        user_prompt = f"Review the following {language} code:\n\n{code}"
                        
                        completion = client.chat.completions.create(
                            model="llama3-70b-8192",
                            messages=[
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_prompt}
                            ],
                            temperature=0.2,
                        )
                        
                        content = completion.choices[0].message.content
                        if content.startswith('```json'):
                            content = content.replace('```json\n', '').replace('\n```', '')
                        elif content.startswith('```'):
                            content = content.replace('```\n', '').replace('\n```', '')
                            
                        review_result = json.loads(content)
                        st.session_state['review'] = review_result
                    except Exception as e:
                        st.error(f"Error calling Groq API: {str(e)}")
                        st.session_state['review'] = None
                else:
                    # Mock Response
                    import time
                    time.sleep(1.5)
                    st.session_state['review'] = {
                        "summary": f"Great job! This is a mock AI review since a valid API key was not provided. Your {language} code looks functionally correct but can be improved with some best practices.",
                        "score": 85,
                        "issues": [
                            {
                                "severity": "Medium",
                                "line": "1",
                                "problem": "Console log statement found or similar debug print.",
                                "solution": "Consider removing debug prints in production code or replacing it with a robust logging framework."
                            },
                            {
                                "severity": "Low",
                                "line": "N/A",
                                "problem": "Missing error handling.",
                                "solution": "Consider wrapping your code in a try/catch block if it performs operations that could fail."
                            }
                        ],
                        "improvedCode": f"// Improved {language} code\ntry {{\n  // Your code logic here\n}} catch (error) {{\n  console.error('An error occurred:', error);\n}}",
                        "bestPractices": [
                            "Always remove debugging statements before deploying to production.",
                            "Add comprehensive error handling to prevent application crashes.",
                            "Use descriptive names for variables and functions.",
                            "Write unit tests to verify the logic of your code."
                        ]
                    }

with col2:
    st.subheader("Review Results")
    if 'review' in st.session_state and st.session_state['review']:
        review = st.session_state['review']
        
        # Score and Summary
        score = review.get('score', 0)
        st.metric(label="Overall Score", value=f"{score}/100")
        
        st.info(review.get('summary', 'No summary provided.'))
        
        # Best Practices
        with st.expander("✅ Best Practices", expanded=True):
            for practice in review.get('bestPractices', []):
                st.write(f"- {practice}")
                
        # Issues
        with st.expander("⚠️ Identified Issues", expanded=True):
            issues = review.get('issues', [])
            if not issues:
                st.success("No critical issues found!")
            else:
                for issue in issues:
                    color = "red" if issue.get('severity') == "High" else "orange" if issue.get('severity') == "Medium" else "blue"
                    st.markdown(f"**<span style='color:{color}'>[{issue.get('severity')}]</span> Line {issue.get('line')}:** {issue.get('problem')}", unsafe_allow_html=True)
                    st.markdown(f"> **Fix:** {issue.get('solution')}")
                    
        # Improved Code
        with st.expander("✨ Improved Code", expanded=True):
            st.code(review.get('improvedCode', ''), language=language.lower())
    else:
        st.write("Submit your code to see the review results here.")
