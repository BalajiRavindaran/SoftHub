import React, { useEffect, useState } from 'react';
import './QuickSightDashboard.css';

const QuickSightDashboard = () => {
  const [embedUrl, setEmbedUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        const response = await fetch('https://YOUR_API_GATEWAY_URL/get-embed-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dashboardId: 'YOUR_DASHBOARD_ID' }), // Pass the dashboard ID here
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setEmbedUrl(data.embedUrl);
      } catch (error) {
        console.error('Error fetching embed URL:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmbedUrl();
  }, []);

  return (
    <div className="quicksight-container">
      {loading ? (
        <p>Loading...</p>
      ) : embedUrl ? (
        
    <iframe
    width="960"
    height="720"
    src="https://ca-central-1.quicksight.aws.amazon.com/sn/embed/share/accounts/490004649075/dashboards/fca0abd1-2861-486f-b8ab-2543d4d36421?directory_alias=coen6313-quick">
</iframe>
      ) : (
        <p>Error loading dashboard.</p>
      )}
    </div>
  );
};

export default QuickSightDashboard;
