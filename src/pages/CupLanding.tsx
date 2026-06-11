import flyer from "@/assets/cup/flyer.png";
import groups from "@/assets/cup/groups.png";

const groupsData = [
  { name: "GROUP A", color: "bg-blue-600", teams: ["The Posse", "JFC Stre3t", "Stack FC", "Box Seats FC"] },
  { name: "GROUP B", color: "bg-yellow-400 text-black", teams: ["Real Santana", "Street Ballers", "ATL Youth Development", "Tramore United"] },
  { name: "GROUP C", color: "bg-orange-600", teams: ["Give Fútbol Performance", "Barcita", "African Strikers", "RedTop F.C."] },
  { name: "GROUP D", color: "bg-blue-600", teams: ["Streets FC", "ProX FC", "Türkiye", "La Clica"] },
];

const saturdaySchedule = [
  ["4:00 PM", "Streets FC vs La Clica", "The Posse vs JFC Stre3t", "Stack FC vs Box Seats FC"],
  ["4:15 PM", "Real Santana vs Street Ballers", "GFP vs Barcita", "African Strikers vs RedTop F.C."],
  ["4:30 PM", "The Posse vs Stack FC", "Streets FC vs ProX FC", "Türkiye vs La Clica"],
  ["4:45 PM", "GFP vs RedTop F.C.", "Real Santana vs ATL Youth Dev", "Street Ballers vs Tramore United"],
  ["5:00 PM", "ProX FC vs Türkiye", "The Posse vs Box Seats FC", "JFC Stre3t vs Stack FC"],
  ["5:15 PM", "Barcita vs African Strikers", "Real Santana vs Tramore United", "Street Ballers vs ATL Youth Dev"],
  ["5:30 PM", "JFC Stre3t vs Box Seats FC", "Streets FC vs Türkiye", "ProX FC vs La Clica"],
  ["5:45 PM", "ATL Youth Dev vs Tramore United", "GFP vs African Strikers", "Barcita vs RedTop F.C."],
];

const sundaySchedule: [string, string][] = [
  ["4:00 PM", "Quarterfinal 1 — A1 vs B2"],
  ["4:15 PM", "Quarterfinal 2 — C1 vs D2"],
  ["4:30 PM", "Quarterfinal 3 — B1 vs A2"],
  ["4:45 PM", "Quarterfinal 4 — D1 vs C2"],
  ["5:15 PM", "Semifinal 1"],
  ["5:30 PM", "Semifinal 2"],
  ["6:00 PM", "Championship Final"],
  ["6:15 PM", "Trophy Presentation"],
];

const rules = [
  "Matches are 10 minutes OR first to 5 goals.",
  "Ball crossing the line is out of play unless modified by tournament staff.",
  "Substitutions only when play is stopped.",
  "Teams must notify the referee before making substitutions.",
  "If a defending player stops the ball in the penalty area, a penalty is awarded.",
  "Referee decisions are final.",
  "Teams must be ready at scheduled kickoff times.",
];

const CupLanding = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <img
            src={flyer}
            alt="5 Points Cup — June 13 & 14 at Underground Atlanta. Sixteen teams. $10,000 grand prize."
            className="w-full max-w-3xl mx-auto rounded-xl shadow-2xl"
          />
        </div>
      </section>

      {/* Key info strip */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Dates</p>
            <p className="text-lg md:text-xl font-bold mt-1">June 13 & 14</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Hours</p>
            <p className="text-lg md:text-xl font-bold mt-1">4:00 – 7:00 PM</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Format</p>
            <p className="text-lg md:text-xl font-bold mt-1">16 Teams · 4 Groups</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Grand Prize</p>
            <p className="text-lg md:text-xl font-bold mt-1 text-primary">$10,000</p>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-6 text-center text-sm text-muted-foreground">
          Underground Atlanta · 50 Upper Alabama St, Atlanta, GA 30303
        </div>
      </section>

      {/* Groups visual */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-8">THE GROUPS</h2>
        <img
          src={groups}
          alt="Five Points Cup group stage bracket showing Groups A, B, C, and D with four teams each."
          className="w-full max-w-5xl mx-auto rounded-xl shadow-xl"
        />

        {/* Group cards (text fallback / accessibility) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {groupsData.map((g) => (
            <div key={g.name} className="rounded-xl border border-border overflow-hidden bg-card">
              <div className={`${g.color} text-white px-4 py-3 font-black tracking-wider text-center`}>{g.name}</div>
              <ul className="divide-y divide-border">
                {g.teams.map((t) => (
                  <li key={t} className="px-4 py-3 text-sm font-semibold">{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Arrival */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-6">ARRIVAL</h2>
        <div className="max-w-2xl mx-auto grid sm:grid-cols-3 gap-4 text-center">
          {[
            ["3:30 – 3:45 PM", "Team Check-In"],
            ["3:50 PM", "Captain's Meeting"],
            ["4:00 PM", "First Kickoff"],
          ].map(([time, label]) => (
            <div key={label} className="rounded-lg border border-border bg-card p-4">
              <p className="font-black text-primary">{time}</p>
              <p className="text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Saturday schedule */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-2">SATURDAY · GROUP STAGE</h2>
        <p className="text-center text-muted-foreground mb-6">June 13</p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-left">Field 1</th>
                <th className="px-3 py-2 text-left">Field 2</th>
                <th className="px-3 py-2 text-left">Field 3</th>
              </tr>
            </thead>
            <tbody>
              {saturdaySchedule.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-2 font-bold text-primary whitespace-nowrap">{row[0]}</td>
                  <td className="px-3 py-2">{row[1]}</td>
                  <td className="px-3 py-2">{row[2]}</td>
                  <td className="px-3 py-2">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sunday schedule */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-2">SUNDAY · KNOCKOUT STAGE</h2>
        <p className="text-center text-muted-foreground mb-6">June 14</p>
        <div className="max-w-2xl mx-auto rounded-xl border border-border overflow-hidden">
          {sundaySchedule.map(([time, label], i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0 bg-card">
              <span className="font-bold text-primary">{time}</span>
              <span className="font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Rules */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-6">TOURNAMENT RULES</h2>
        <ul className="max-w-2xl mx-auto space-y-3">
          {rules.map((r, i) => (
            <li key={i} className="flex gap-3 bg-card border border-border rounded-lg p-4">
              <span className="font-black text-primary">{i + 1}.</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Five Points Cup · Underground Atlanta
      </footer>
    </div>
  );
};

export default CupLanding;