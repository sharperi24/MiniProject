import { ExternalLink, Book, Heart, Users } from 'lucide-react';
import { COLORS } from '../styles/theme';

const Resources = () => {
  const resources = [
    {
      category: "Mental Health Support",
      icon: <Heart className="w-5 h-5 mr-2 text-red-500" />,
      items: [
        { title: "National Alliance on Mental Illness", url: "https://nami.org", description: "Support and education for mental health" },
        { title: "Mental Health America", url: "https://www.mhanational.org", description: "Resources and support for mental health" },
        { title: "Crisis Text Line", url: "https://www.crisistextline.org", description: "Text support for mental health crises" },
        { title: "AASRA", url: "http://www.aasra.info", description: "24/7 helpline for emotional support in India" },
        { title: "Vandrevala Foundation Helpline", url: "https://vandrevalafoundation.com", description: "Mental health support and resources in India" }
      ]
    },
    {
      category: "Self-Help Resources",
      icon: <Book className="w-5 h-5 mr-2 text-blue-500" />,
      items: [
        { title: "Headspace", url: "https://www.headspace.com", description: "Meditation and mindfulness app" },
        { title: "Calm", url: "https://www.calm.com", description: "Sleep and meditation app" },
        { title: "Moodfit", url: "https://getmoodfit.com", description: "Mental health fitness app" }
      ]
    },
    {
      category: "Community Support",
      icon: <Users className="w-5 h-5 mr-2 text-purple-500" />,
      items: [
        { title: "7 Cups", url: "https://www.7cups.com", description: "Online chat for emotional support" },
        { title: "BetterHelp", url: "https://www.betterhelp.com", description: "Online therapy platform" },
        { title: "TherapyChat", url: "https://www.therapychat.com", description: "Find a therapist online" },
        { title: "iCall", url: "https://icallhelpline.org", description: "Emotional support and counseling services in India" }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className={`text-3xl font-bold mb-8 ${COLORS.textPrimary}`}>Development Resources</h1>
      
      <div className="space-y-8">
        {resources.map((category) => (
          <div key={category.category} className={`${COLORS.primary} p-6 rounded-lg shadow-md transition-transform transform hover:scale-105`}>
            <h2 className={`text-xl font-semibold mb-4 flex items-center ${COLORS.textPrimary}`}>
              {category.icon}
              {category.category}
            </h2>
            
            <div className="grid gap-4">
              {category.items.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  className={`flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                >
                  <div>
                    <h3 className={`font-medium ${COLORS.textPrimary}`}>{item.title}</h3>
                    <p className={`text-sm ${COLORS.textSecondary}`}>{item.description}</p>
                  </div>
                  <ExternalLink className={COLORS.textMuted} />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;