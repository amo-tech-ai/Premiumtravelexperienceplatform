import { useState } from "react";
import { AnalysisHeader } from "../../components/ai-analysis/AnalysisHeader";
import { StartupOverview } from "../../components/ai-analysis/StartupOverview";
import { FounderIdentity } from "../../components/ai-analysis/FounderIdentity";
import { WebsiteContext } from "../../components/ai-analysis/WebsiteContext";
import { MarketIntelligence } from "../../components/ai-analysis/MarketIntelligence";
import { DetectedSignals } from "../../components/ai-analysis/DetectedSignals";
import { ResearchQueries } from "../../components/ai-analysis/ResearchQueries";
import { IntelligenceRail } from "../../components/ai-analysis/IntelligenceRail";

export default function AIAnalysisPage() {
  // Mock data - in production, this would come from your state management
  const [startupData, setStartupData] = useState({
    companyName: "TripOS",
    description: "AI-powered trip operating system that uses six specialized agents to automate complex travel planning through an intelligent event bus architecture.",
    industry: "Travel Technology",
    tags: ["AI/ML", "SaaS", "Travel Tech", "Enterprise Software"],
  });

  const [founders] = useState([
    {
      name: "Sarah Martinez",
      role: "CEO & Co-Founder",
      bio: "Former Head of Product at Booking.com with 10+ years in travel technology. Built AI recommendation systems serving 50M+ users.",
      experience: [
        "Led AI/ML initiatives at Booking.com (2018-2023)",
        "Product Manager at Airbnb Experiences (2015-2018)",
        "Computer Science, Stanford University",
      ],
      signals: ["Founder–market fit", "Domain expertise"],
    },
  ]);

  const [websiteInsights] = useState([
    {
      label: "Value Proposition",
      value: "Automates complex travel planning through AI agents, eliminating manual research and coordination for both travelers and travel professionals.",
      note: "Gemini inferred — confirm or refine",
    },
    {
      label: "Key Features",
      value: "Event bus architecture, 6 specialized AI agents (Local Scout, Itinerary Optimizer, Dining Orchestrator, Budget Guardian, Booking Assistant, Group Coordinator)",
      note: "Extracted from website content",
    },
    {
      label: "Target Audience",
      value: "Digital nomads, luxury travelers, group trip organizers, travel agents, and corporate travel managers",
      note: "Gemini inferred from use cases",
    },
    {
      label: "Detected Phrases",
      value: '"Trip Operating System", "Proactive Assistant", "Collaboration Engine", "Luxury, calm, confident aesthetic"',
      note: "Direct quotes from marketing materials",
    },
  ]);

  const [competitors, setCompetitors] = useState([
    {
      name: "TripIt",
      positioning: "Travel organization tool focused on itinerary management and consolidation. Less AI-driven, more manual organization.",
    },
    {
      name: "Mezi (acquired by American Express)",
      positioning: "AI travel assistant focusing on chat-based booking. Limited multi-agent orchestration.",
    },
    {
      name: "Lola.com",
      positioning: "Hybrid human-AI travel planning. Higher touch, less automated than TripOS.",
    },
  ]);

  const [marketTrends] = useState([
    "AI automation in travel industry growing 24% YoY",
    "Event-driven architectures becoming standard for complex SaaS",
    "Corporate travel market recovering post-pandemic (expected $1.4T by 2024)",
  ]);

  const [marketLabels] = useState([
    "AI Travel Tech",
    "SaaS",
    "B2B2C",
    "Enterprise",
    "Multi-agent Systems",
  ]);

  const [signalGroups] = useState([
    {
      category: "Product",
      signals: [
        { label: "Novel architecture", validated: true },
        { label: "Clear differentiation", validated: true },
        { label: "Technical complexity", validated: false },
      ],
    },
    {
      category: "Market",
      signals: [
        { label: "Large TAM ($1.4T)", validated: true },
        { label: "Growing category", validated: true },
        { label: "Competitive landscape", validated: false },
      ],
    },
    {
      category: "Team",
      signals: [
        { label: "Domain expertise", validated: true },
        { label: "Product experience", validated: true },
        { label: "Technical capability", validated: true },
      ],
    },
  ]);

  const [researchQueries] = useState([
    {
      query: "TripOS AI travel planning system",
      sources: ["Website", "LinkedIn"],
    },
    {
      query: "Sarah Martinez Booking.com AI product",
      sources: ["LinkedIn", "Reviews"],
    },
    {
      query: "AI agent orchestration travel industry",
      sources: ["Website", "Reviews"],
    },
    {
      query: "TripOS competitors travel technology",
      sources: ["Website", "Reviews"],
    },
  ]);

  const aiInsight = {
    brief: "TripOS represents a sophisticated technical approach to travel automation with strong founder-market fit. The multi-agent architecture demonstrates deep technical understanding, though market education will be crucial.",
    strength: "Founder experience at scale (50M+ users at Booking.com) combined with novel technical architecture creates defensible competitive advantage.",
    risk: "Complex multi-agent systems face adoption friction. Need clear path to demonstrate ROI over simpler alternatives.",
  };

  const recommendedActions = [
    { label: "Validate founder details", completed: true, targetSection: "founder-identity" },
    { label: "Confirm competitors", completed: false, targetSection: "market-intelligence" },
    { label: "Review pricing", completed: false, targetSection: "startup-overview" },
  ];

  // Handlers
  const handleUpdateStartup = (field: string, value: string) => {
    setStartupData({ ...startupData, [field]: value });
  };

  const handleAIEnhance = (field: string, action: string) => {
    console.log(`AI Enhance: ${field} with action ${action}`);
    // In production, this would call your AI enhancement API
  };

  const handleUpdateFounder = (founderIndex: number, field: string, value: string | string[]) => {
    console.log(`Update founder ${founderIndex}: ${field} = ${value}`);
  };

  const handleFounderAIEnhance = (founderIndex: number, field: string, action: string) => {
    console.log(`AI Enhance founder ${founderIndex}: ${field} with action ${action}`);
  };

  const handleUpdateWebsiteInsight = (index: number, value: string) => {
    console.log(`Update insight ${index}: ${value}`);
  };

  const handleWebsiteInsightAIEnhance = (index: number, action: string) => {
    console.log(`AI Enhance insight ${index} with action ${action}`);
  };

  const handleUpdateCompetitor = (index: number, field: string, value: string) => {
    const updated = [...competitors];
    updated[index] = { ...updated[index], [field]: value };
    setCompetitors(updated);
  };

  const handleRemoveCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const handleAddCompetitor = () => {
    setCompetitors([
      ...competitors,
      { name: "", positioning: "" },
    ]);
  };

  const handleCompetitorAIEnhance = (index: number, action: string) => {
    console.log(`AI Enhance competitor ${index} with action ${action}`);
  };

  const handleChallengeSignal = (category: string, signalIndex: number) => {
    console.log(`Challenge signal: ${category} - ${signalIndex}`);
  };

  const handleContinue = () => {
    console.log("Continue to Smart Interview");
    // Navigate to next step
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <AnalysisHeader onContinue={handleContinue} />

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div className="space-y-8">
            <div data-section="startup-overview">
              <StartupOverview
                companyName={startupData.companyName}
                description={startupData.description}
                industry={startupData.industry}
                tags={startupData.tags}
                onUpdate={handleUpdateStartup}
                onAIEnhance={handleAIEnhance}
              />
            </div>

            <div data-section="founder-identity">
              <FounderIdentity
                founders={founders}
                onUpdate={handleUpdateFounder}
                onAIEnhance={handleFounderAIEnhance}
              />
            </div>

            <div data-section="website-context">
              <WebsiteContext
                insights={websiteInsights}
                onUpdate={handleUpdateWebsiteInsight}
                onAIEnhance={handleWebsiteInsightAIEnhance}
              />
            </div>

            <div data-section="market-intelligence">
              <MarketIntelligence
                competitors={competitors}
                marketTrends={marketTrends}
                marketLabels={marketLabels}
                onUpdateCompetitor={handleUpdateCompetitor}
                onRemoveCompetitor={handleRemoveCompetitor}
                onAddCompetitor={handleAddCompetitor}
                onAIEnhance={handleCompetitorAIEnhance}
              />
            </div>

            <div data-section="detected-signals">
              <DetectedSignals
                signalGroups={signalGroups}
                onChallengeSignal={handleChallengeSignal}
              />
            </div>

            <div data-section="research-queries">
              <ResearchQueries queries={researchQueries} />
            </div>
          </div>

          {/* Right Intelligence Rail */}
          <div>
            <IntelligenceRail
              aiInsight={aiInsight}
              recommendedActions={recommendedActions}
              confidenceScore={87}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
