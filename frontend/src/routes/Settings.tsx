import PageHeader from "@/components/PageHeader";
import PacketSettings from "@/components/PacketSettings";

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="w-full h-full p-2">
      <p className="text-4xl font-bold">{title}</p>
      <p>{description}</p>
      {children}
    </div>
  );
}

export default function Settings() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure application preferences"
      />
      <SettingsSection
        title="Packets"
        description="Modify your current packet structure"
      >
        <PacketSettings />
      </SettingsSection>
    </>
  );
}

