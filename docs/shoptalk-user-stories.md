# ShopTalk User Stories

## Document Purpose

Exhaustive user story inventory for the UPS Teamster Contract Assistant MVP. Stories organized by persona, context, and functional area. Each story follows the format:

**As a [persona], I want to [action], so that [outcome].**

Stories tagged with priority:
- 🔴 **P0** — Must have for MVP launch
- 🟡 **P1** — Should have, high impact
- 🟢 **P2** — Nice to have, can defer

---

## Personas

### Primary Personas

| Persona | Description | Key Characteristics |
|---------|-------------|---------------------|
| **Rank-and-File Worker** | Standard UPS employee, not a union officer | Limited contract knowledge; needs answers fast; may be stressed |
| **Shop Steward** | Elected union representative | Deeper contract knowledge; helps others; needs to verify/cite |
| **New Hire** | Recently started at UPS | Unfamiliar with contract; many basic questions; learning culture |

### Secondary Personas

| Persona | Description | Key Characteristics |
|---------|-------------|---------------------|
| **Experienced Worker** | 10+ years, knows contract well | Uses app to verify memory; precise citation needs |
| **Part-Time Hub Worker** | Sorts packages, often younger | Different schedule concerns; may be less invested |
| **Driver (RPCD/22.4)** | Package car or feeder driver | Mobile all day; 9.5 concerns; DOT regulations intersection |
| **22.3 Combo Worker** | Two part-time jobs combined | Complex classification questions; unique scheduling issues |

### Contextual States

| Context | Description | Implications |
|---------|-------------|--------------|
| **In Crisis** | Active confrontation with management | Needs answer in seconds; high stress; may have limited privacy |
| **Preparing** | Building a grievance case | Needs comprehensive info; multiple queries; citation accuracy critical |
| **Learning** | Exploring contract out of curiosity | Lower urgency; may browse; open to discovering new information |
| **Verifying** | Checking something heard from others | Needs source confirmation; may be skeptical |
| **Helping Others** | Assisting a coworker with their issue | May not know full context; needs to relay information clearly |

---

## Epic 1: Onboarding & Authentication

### First-Time User Registration

🔴 **P0** | As a **new user**, I want to **sign up with just my phone number**, so that **I don't have to remember another password**.

🔴 **P0** | As a **new user**, I want to **receive a magic link via text message**, so that **I can authenticate without typing a code on my phone**.

🔴 **P0** | As a **new user**, I want to **tap the magic link and be taken directly into the app**, so that **there's no friction to get started**.

🟡 **P1** | As a **new user**, I want to **sign up with my email if I prefer**, so that **I have options based on my preference**.

🟡 **P1** | As a **new user**, I want to **see a brief explanation of what the app does before signing up**, so that **I understand why I should trust it with my information**.

🟢 **P2** | As a **privacy-conscious user**, I want to **understand what data is collected and how it's used**, so that **I can make an informed decision about using the app**.

### Profile Setup

🔴 **P0** | As a **new user**, I want to **select my Local union number from a searchable list**, so that **I get the right contract documents for my location**.

🔴 **P0** | As a **new user**, I want to **see my Local's name displayed after selecting the number**, so that **I can confirm I chose correctly**.

🔴 **P0** | As a **new user**, I want to **select my job classification from a list**, so that **responses are relevant to my specific role**.

🔴 **P0** | As a **new user**, I want to **see which contract documents apply to me after setup**, so that **I understand what I'm searching**.

🟡 **P1** | As a **new user who doesn't know my Local number**, I want to **search by city or state**, so that **I can find my Local even if I don't have the number memorized**.

🟡 **P1** | As a **new user with an unusual classification**, I want to **enter a custom job title if mine isn't listed**, so that **I'm not blocked from using the app**.

🟢 **P2** | As a **new user**, I want to **skip optional profile fields and complete them later**, so that **I can start using the app quickly**.

🟢 **P2** | As a **new user**, I want to **see a progress indicator during onboarding**, so that **I know how many steps remain**.

### Returning User Authentication

🔴 **P0** | As a **returning user**, I want to **stay logged in across sessions**, so that **I don't have to re-authenticate every time**.

🔴 **P0** | As a **returning user**, I want to **go directly to the query interface when I open the app**, so that **I can get answers immediately**.

🟡 **P1** | As a **returning user on a new device**, I want to **sign in with another magic link**, so that **I can access my account without a password**.

🟡 **P1** | As a **returning user**, I want to **explicitly log out if I choose**, so that **I can protect my privacy on shared devices**.

🟢 **P2** | As a **returning user whose session expired**, I want to **re-authenticate seamlessly without losing context**, so that **I don't have to start over**.

### Authentication Edge Cases

🔴 **P0** | As a **user who never receives the magic link**, I want to **easily request a new one**, so that **I'm not locked out**.

🟡 **P1** | As a **user who clicks an expired magic link**, I want to **see a clear message and easy path to request a new one**, so that **I understand what happened**.

🟡 **P1** | As a **user who entered the wrong phone number**, I want to **go back and correct it**, so that **I receive the link at the right number**.

🟢 **P2** | As a **user with a phone number that previously belonged to someone else**, I want to **create my own account without inheriting their data**, so that **my experience is mine**.

---

## Epic 2: Contract Query Interface

### Asking Questions

🔴 **P0** | As a **worker**, I want to **type a question in plain English**, so that **I don't need to know contract terminology to find answers**.

🔴 **P0** | As a **worker**, I want to **submit my question with a single tap**, so that **I can get answers quickly**.

🔴 **P0** | As a **worker**, I want to **see a loading indicator while my question is processed**, so that **I know the app is working**.

🔴 **P0** | As a **worker**, I want to **receive an answer within a few seconds**, so that **I can use this in time-sensitive situations**.

🟡 **P1** | As a **worker who doesn't know what to ask**, I want to **see example questions or common topics**, so that **I can get started even if I'm unsure how to phrase my question**.

🟡 **P1** | As a **worker**, I want to **ask follow-up questions in the same session**, so that **I can dig deeper into a topic**.

🟡 **P1** | As a **worker**, I want to **easily start a completely new question**, so that **I can switch topics without confusion**.

🟢 **P2** | As a **worker**, I want to **use voice input to ask my question**, so that **I can use the app when my hands aren't free**.

🟢 **P2** | As a **worker**, I want to **see my question auto-corrected for typos**, so that **minor errors don't affect my results**.

### Query Context & Personalization

🔴 **P0** | As a **worker**, I want to **have my search automatically limited to my applicable documents**, so that **I don't get irrelevant results from other regions**.

🟡 **P1** | As a **driver**, I want to **see driver-specific information prioritized**, so that **I get the most relevant answers for my classification**.

🟡 **P1** | As a **worker**, I want to **know which documents are being searched**, so that **I understand the scope of my results**.

🟢 **P2** | As a **steward helping someone from a different Local**, I want to **temporarily search a different document set**, so that **I can assist workers outside my jurisdiction**.

🟢 **P2** | As a **worker**, I want to **search the Master Agreement only if I choose**, so that **I can find language that applies everywhere**.

### Query Input Interaction

🔴 **P0** | As a **worker**, I want to **submit my query by pressing Enter on the keyboard**, so that **I can use natural mobile typing patterns**.

🔴 **P0** | As a **worker**, I want to **see what I'm typing clearly**, so that **I can verify my question before submitting**.

🟡 **P1** | As a **worker**, I want to **have a text area that expands for longer questions**, so that **I can see my full question if it's complex**.

🟡 **P1** | As a **worker**, I want to **clear my input easily**, so that **I can start over if I change my mind**.

🟢 **P2** | As a **worker**, I want to **paste text from another app into my query**, so that **I can use questions I've drafted elsewhere**.

---

## Epic 3: Response Display

### Answer Presentation

🔴 **P0** | As a **worker**, I want to **see a clear, readable answer to my question**, so that **I understand what the contract says**.

🔴 **P0** | As a **worker**, I want to **see citations for every claim in the answer**, so that **I can trust the information is accurate**.

🔴 **P0** | As a **worker**, I want to **see a disclaimer that this is reference info, not legal advice**, so that **I understand the app's limitations**.

🔴 **P0** | As a **worker**, I want to **easily distinguish the answer text from citations and metadata**, so that **I can quickly scan for what I need**.

🟡 **P1** | As a **worker**, I want to **see the most important information first**, so that **I get value immediately without scrolling**.

🟡 **P1** | As a **worker**, I want to **see answers formatted with clear structure (headers, bullets when appropriate)**, so that **complex answers are easy to follow**.

🟡 **P1** | As a **worker**, I want to **see when the answer draws from multiple documents**, so that **I understand the full picture**.

🟢 **P2** | As a **worker**, I want to **see answers with key terms highlighted**, so that **contract language stands out from explanation**.

🟢 **P2** | As a **worker**, I want to **have answers read aloud to me**, so that **I can listen while doing other things**.

### Citation Interaction

🔴 **P0** | As a **worker**, I want to **tap a citation to see the source document**, so that **I can verify the answer myself**.

🔴 **P0** | As a **worker**, I want to **see which document, article, section, and page each citation references**, so that **I can locate it manually if needed**.

🟡 **P1** | As a **worker**, I want to **citations to be visually tappable (button-like)**, so that **I know I can interact with them**.

🟡 **P1** | As a **steward**, I want to **copy citation information easily**, so that **I can paste it into a grievance form**.

🟢 **P2** | As a **worker**, I want to **see all citations collected at the end of the answer**, so that **I have a summary of sources**.

🟢 **P2** | As a **steward**, I want to **share a specific citation with a coworker**, so that **they can verify it themselves**.

### No Results / Uncertainty Handling

🔴 **P0** | As a **worker**, I want to **see a helpful message when no relevant contract language is found**, so that **I know this isn't an app error**.

🔴 **P0** | As a **worker**, I want to **be encouraged to consult my steward when the app can't help**, so that **I have a next step**.

🟡 **P1** | As a **worker**, I want to **understand why no results were found (not in contract vs. not in my documents)**, so that **I can decide what to do next**.

🟡 **P1** | As a **worker**, I want to **rephrase my question easily when results aren't helpful**, so that **I can try a different approach**.

🟢 **P2** | As a **worker**, I want to **request that a topic be added to the app**, so that **future users benefit from my question**.

🟢 **P2** | As a **worker**, I want to **see related topics that might help**, so that **I can explore adjacent questions**.

---

## Epic 4: Source Document Viewing

### PDF Navigation

🔴 **P0** | As a **worker**, I want to **view the actual contract PDF at the cited page**, so that **I can read the full context**.

🔴 **P0** | As a **worker**, I want to **navigate to other pages in the document**, so that **I can read surrounding sections**.

🔴 **P0** | As a **worker**, I want to **return to my answer easily after viewing the source**, so that **I don't lose my place**.

🟡 **P1** | As a **worker**, I want to **zoom in on the PDF text**, so that **I can read small text on my phone**.

🟡 **P1** | As a **worker**, I want to **see the document title and current page number**, so that **I know where I am in the document**.

🟡 **P1** | As a **worker**, I want to **the PDF to load quickly, even on slower connections**, so that **I don't wait a long time**.

🟢 **P2** | As a **worker**, I want to **search within the PDF**, so that **I can find specific language**.

🟢 **P2** | As a **worker**, I want to **see the cited passage highlighted or indicated**, so that **I can find it quickly on the page**.

🟢 **P2** | As a **worker**, I want to **download the full PDF**, so that **I have a copy for offline reference**.

### PDF Fallback & Errors

🔴 **P0** | As a **worker whose browser can't render PDFs well**, I want to **have a fallback option to view the document**, so that **I'm not stuck**.

🟡 **P1** | As a **worker on a slow connection**, I want to **see a loading indicator while the PDF loads**, so that **I know it's working**.

🟡 **P1** | As a **worker**, I want to **be told if a PDF fails to load and given alternatives**, so that **I can still access the information**.

---

## Epic 5: Query History

### Viewing Past Queries

🔴 **P0** | As a **worker**, I want to **see my recent questions**, so that **I can revisit past answers without retyping**.

🔴 **P0** | As a **worker**, I want to **tap a past query to see the full answer again**, so that **I can reference it easily**.

🟡 **P1** | As a **worker**, I want to **see when I asked each question**, so that **I can find queries from specific times**.

🟡 **P1** | As a **worker**, I want to **see a preview of each answer in the history list**, so that **I can identify the right one quickly**.

🟢 **P2** | As a **worker**, I want to **search my query history**, so that **I can find specific past questions**.

🟢 **P2** | As a **worker**, I want to **delete queries from my history**, so that **I can remove things I no longer need**.

### Sharing & Bookmarking

🟡 **P1** | As a **worker**, I want to **share a query result with a coworker via link**, so that **they can see the same answer**.

🟡 **P1** | As a **worker receiving a shared link**, I want to **view the answer without signing up first**, so that **I can evaluate the app before committing**.

🟢 **P2** | As a **worker**, I want to **bookmark important queries**, so that **I can find them faster than scrolling through history**.

🟢 **P2** | As a **steward**, I want to **organize saved queries by topic**, so that **I can build a personal reference library**.

---

## Epic 6: Profile & Settings

### Profile Management

🔴 **P0** | As a **worker**, I want to **view my current profile (Local, classification)**, so that **I can confirm my settings are correct**.

🔴 **P0** | As a **worker**, I want to **change my Local number if I transfer**, so that **I get the right documents after a move**.

🔴 **P0** | As a **worker**, I want to **change my job classification if it changes**, so that **my results stay relevant**.

🟡 **P1** | As a **worker**, I want to **see which documents apply to my current profile**, so that **I understand my search scope**.

🟢 **P2** | As a **worker**, I want to **update my phone number or email**, so that **I can receive magic links at my current contact**.

### Preferences

🟢 **P2** | As a **worker**, I want to **choose a light or dark theme**, so that **the app is comfortable in different lighting**.

🟢 **P2** | As a **worker**, I want to **adjust text size**, so that **I can read comfortably based on my vision needs**.

🟢 **P2** | As a **worker**, I want to **control whether I see suggested questions**, so that **I can customize my experience**.

### Account & Privacy

🟡 **P1** | As a **worker**, I want to **delete my account and all my data**, so that **I have control over my information**.

🟡 **P1** | As a **worker**, I want to **log out of all devices**, so that **I can secure my account if I lose a phone**.

🟢 **P2** | As a **worker**, I want to **export my query history**, so that **I have a backup of my research**.

---

## Epic 7: Progressive Web App

### Installation

🟡 **P1** | As a **worker**, I want to **install the app to my home screen**, so that **I can access it like a native app**.

🟡 **P1** | As a **worker**, I want to **be prompted to install after I've used the app a few times**, so that **I'm not pressured immediately**.

🟡 **P1** | As a **worker**, I want to **dismiss the install prompt and not see it again for a while**, so that **I'm not nagged**.

🟢 **P2** | As a **worker**, I want to **see instructions for installing on my specific device**, so that **I know what to do**.

### Offline Behavior

🔴 **P0** | As a **worker who loses internet connection**, I want to **see a clear message that I'm offline**, so that **I understand why queries aren't working**.

🟡 **P1** | As a **worker who loses connection**, I want to **still access the app shell**, so that **it doesn't appear completely broken**.

🟢 **P2** | As a **worker**, I want to **view my recent query history while offline**, so that **I can reference past answers**.

🟢 **P2** | As a **worker**, I want to **queue a query while offline and have it run when I reconnect**, so that **I don't have to remember to ask later**.

---

## Epic 8: Contextual Usage Scenarios

### Crisis Mode (Active Confrontation)

🔴 **P0** | As a **worker in a confrontation with my supervisor**, I want to **find an answer in under 10 seconds**, so that **I can respond before the moment passes**.

🟡 **P1** | As a **worker in a confrontation**, I want to **show the source document on my screen**, so that **I can prove I'm not making it up**.

🟡 **P1** | As a **worker in a crisis**, I want to **the app to work reliably on my phone's cellular connection**, so that **I'm not let down when it matters most**.

🟢 **P2** | As a **worker in a crisis**, I want to **quickly access my most common questions**, so that **I don't have to type under pressure**.

### Grievance Preparation

🟡 **P1** | As a **worker preparing a grievance**, I want to **ask multiple related questions in sequence**, so that **I can build a complete case**.

🟡 **P1** | As a **worker preparing a grievance**, I want to **easily copy the exact contract language**, so that **I can paste it into my grievance form**.

🟡 **P1** | As a **steward preparing a grievance**, I want to **have precise citations (article, section, page)**, so that **my grievance is professionally formatted**.

🟢 **P2** | As a **steward**, I want to **see cross-references between Master and supplement language**, so that **I cite the strongest source**.

### Helping Others

🟡 **P1** | As a **steward**, I want to **answer questions on behalf of members from different classifications**, so that **I can help anyone who asks**.

🟡 **P1** | As a **experienced worker helping a newbie**, I want to **share a link to an answer**, so that **they can read it themselves**.

🟢 **P2** | As a **steward**, I want to **temporarily view another Local's documents**, so that **I can help with questions outside my jurisdiction**.

### Learning & Exploration

🟡 **P1** | As a **new hire**, I want to **see common questions that other new hires ask**, so that **I can learn the basics**.

🟢 **P2** | As a **curious worker**, I want to **browse the contract by topic**, so that **I can learn about areas I haven't thought to ask about**.

🟢 **P2** | As a **worker**, I want to **see "did you know" tips about lesser-known contract provisions**, so that **I discover rights I wasn't aware of**.

---

## Epic 9: Trust & Accuracy

### Transparency

🔴 **P0** | As a **worker**, I want to **see that every answer is backed by citations**, so that **I trust the information**.

🔴 **P0** | As a **worker**, I want to **verify citations myself by viewing the source**, so that **I don't have to take the app's word for it**.

🟡 **P1** | As a **skeptical worker**, I want to **see that the app only uses official contract documents**, so that **I know it's not making things up**.

🟡 **P1** | As a **worker**, I want to **understand when the app is uncertain or the answer is incomplete**, so that **I know to seek additional guidance**.

### Error & Limitation Acknowledgment

🔴 **P0** | As a **worker**, I want to **see a clear disclaimer that this is not legal advice**, so that **I understand the app's role**.

🟡 **P1** | As a **worker**, I want to **know what documents are NOT included in my search**, so that **I understand potential gaps**.

🟡 **P1** | As a **worker whose Local's rider isn't in the system**, I want to **be told my coverage is limited**, so that **I don't assume I have complete information**.

🟢 **P2** | As a **worker**, I want to **report an answer that seems wrong**, so that **the system can be improved**.

---

## Epic 10: Accessibility

### Visual Accessibility

🔴 **P0** | As a **worker with low vision**, I want to **text to be large enough to read on mobile**, so that **I can use the app without strain**.

🔴 **P0** | As a **worker**, I want to **sufficient color contrast**, so that **I can read text in various lighting conditions**.

🟡 **P1** | As a **worker who increases text size in my phone settings**, I want to **the app to respect my preferences**, so that **text is the size I need**.

🟡 **P1** | As a **worker with color blindness**, I want to **information not conveyed by color alone**, so that **I don't miss important cues**.

### Motor Accessibility

🔴 **P0** | As a **worker with limited dexterity**, I want to **tap targets to be large enough (44px minimum)**, so that **I can interact reliably**.

🟡 **P1** | As a **worker**, I want to **enough space between interactive elements**, so that **I don't accidentally tap the wrong thing**.

🟡 **P1** | As a **worker using the app with gloves** (warehouse in winter), I want to **large touch targets**, so that **I can still use the app**.

### Screen Reader Support

🟡 **P1** | As a **worker using VoiceOver or TalkBack**, I want to **all content to be accessible**, so that **I can use the app with my assistive technology**.

🟡 **P1** | As a **screen reader user**, I want to **proper heading structure**, so that **I can navigate the page efficiently**.

🟡 **P1** | As a **screen reader user**, I want to **form inputs to be properly labeled**, so that **I know what to enter**.

---

## Epic 11: Performance & Reliability

### Speed

🔴 **P0** | As a **worker**, I want to **the app to load quickly on a cellular connection**, so that **I can use it anywhere at work**.

🔴 **P0** | As a **worker**, I want to **answers to return within a few seconds**, so that **the app is practical for real-time use**.

🟡 **P1** | As a **worker on a slow connection**, I want to **see incremental progress (streaming response)**, so that **I know something is happening**.

### Reliability

🔴 **P0** | As a **worker**, I want to **the app to work consistently without crashing**, so that **I can depend on it**.

🔴 **P0** | As a **worker**, I want to **clear error messages when something goes wrong**, so that **I know what to do**.

🟡 **P1** | As a **worker**, I want to **the app to recover gracefully from temporary errors**, so that **I don't have to start over**.

🟢 **P2** | As a **worker**, I want to **be notified if there's planned maintenance**, so that **I'm not surprised by downtime**.

---

## Epic 12: Feedback & Improvement

### User Feedback

🟡 **P1** | As a **worker**, I want to **rate whether an answer was helpful**, so that **the system can improve**.

🟡 **P1** | As a **worker**, I want to **report a problem with a specific answer**, so that **errors can be corrected**.

🟢 **P2** | As a **worker**, I want to **suggest a question that should be answered better**, so that **coverage improves over time**.

🟢 **P2** | As a **worker**, I want to **request support for my Local's specific rider**, so that **the team knows there's demand**.

### Communication

🟢 **P2** | As a **worker**, I want to **see what's new when the app is updated**, so that **I know about improvements**.

🟢 **P2** | As a **worker**, I want to **opt into occasional tips or updates**, so that **I can learn more over time**.

---

## Epic 13: Edge Cases & Error States

### Input Edge Cases

🔴 **P0** | As a **worker who submits an empty query**, I want to **see a prompt to enter a question**, so that **I understand what to do**.

🟡 **P1** | As a **worker who submits a very long query**, I want to **be told if there's a character limit**, so that **I can shorten my question**.

🟡 **P1** | As a **worker who asks something completely off-topic** (e.g., "What's the weather?"), I want to **a polite redirect to contract questions**, so that **I understand the app's purpose**.

🟡 **P1** | As a **worker who asks about a topic not in any contract** (e.g., federal law), I want to **be told this is outside the app's scope**, so that **I seek other resources**.

### Network & System Errors

🔴 **P0** | As a **worker who loses connection mid-query**, I want to **see a clear error and option to retry**, so that **I can recover easily**.

🔴 **P0** | As a **worker when the backend is down**, I want to **see a friendly error message**, so that **I know it's not my fault**.

🟡 **P1** | As a **worker who experiences repeated errors**, I want to **a way to report the problem**, so that **someone can help**.

### Session & State Issues

🟡 **P1** | As a **worker who leaves the app open for hours**, I want to **the session to remain valid**, so that **I don't have to re-authenticate unexpectedly**.

🟡 **P1** | As a **worker who navigates away and back**, I want to **my query input to be preserved**, so that **I don't lose what I typed**.

🟡 **P1** | As a **worker using the back button**, I want to **predictable navigation behavior**, so that **I don't get lost**.

---

## Epic 14: Competitive Differentiation

*Stories that specifically address incumbent app failures*

### Authentication (Incumbent Failure: Lockouts)

🔴 **P0** | As a **worker who used the old app**, I want to **never be locked out of my account**, so that **I don't relive that frustration**.

🔴 **P0** | As a **worker**, I want to **authentication to just work**, so that **I can focus on finding answers, not fighting the app**.

### Updates (Incumbent Failure: Broken Updates)

🔴 **P0** | As a **worker**, I want to **the app to always be up-to-date automatically**, so that **I never have to reinstall or troubleshoot**.

🟡 **P1** | As a **worker**, I want to **never see an "update required" screen that blocks me**, so that **the app is always accessible**.

### Search (Incumbent Failure: Irrelevant Results)

🔴 **P0** | As a **worker**, I want to **search results that actually answer my question**, so that **I don't have to wade through irrelevant content**.

🔴 **P0** | As a **worker**, I want to **ask questions in my own words**, so that **I don't have to know the exact contract terminology**.

---

## Summary Statistics

| Priority | Count | Percentage |
|----------|-------|------------|
| 🔴 P0 (Must Have) | 52 | 37% |
| 🟡 P1 (Should Have) | 58 | 41% |
| 🟢 P2 (Nice to Have) | 31 | 22% |
| **Total** | **141** | 100% |

### P0 Stories by Epic

| Epic | P0 Count |
|------|----------|
| Onboarding & Auth | 10 |
| Contract Query Interface | 8 |
| Response Display | 6 |
| Source Document Viewing | 4 |
| Query History | 2 |
| Profile & Settings | 3 |
| PWA | 1 |
| Contextual Usage | 1 |
| Trust & Accuracy | 4 |
| Accessibility | 3 |
| Performance & Reliability | 4 |
| Edge Cases & Errors | 3 |
| Competitive Differentiation | 5 |

---

## Next Steps

1. **Validate P0 stories** with 2-3 target users (ideally including a steward)
2. **Map stories to screens** for wireframing
3. **Identify story dependencies** for development sequencing
4. **Write acceptance criteria** for each P0 story
5. **Estimate effort** for sprint planning
