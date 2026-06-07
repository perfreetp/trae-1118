import { useState } from "react";
import {
  Phone,
  Search,
  PhoneCall,
  Building2,
  User,
  Shield,
  Flame,
  Heart,
  Building,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/utils";
import type { Contact } from "@/types";

export default function Contacts() {
  const { contacts } = useAppStore();
  const [selectedType, setSelectedType] = useState<Contact["type"] | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const typeOptions: { value: Contact["type"] | "all"; label: string; icon: any }[] = [
    { value: "all", label: "全部", icon: Phone },
    { value: "internal", label: "内部人员", icon: User },
    { value: "police", label: "公安系统", icon: Shield },
    { value: "fire", label: "消防系统", icon: Flame },
    { value: "hospital", label: "医疗系统", icon: Heart },
    { value: "government", label: "政府部门", icon: Building },
  ];

  const filteredContacts = contacts.filter((c) => {
    const matchesType = selectedType === "all" || c.type === selectedType;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.position.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: Contact["type"]) => {
    switch (type) {
      case "internal":
        return <User className="w-5 h-5" />;
      case "police":
        return <Shield className="w-5 h-5" />;
      case "fire":
        return <Flame className="w-5 h-5" />;
      case "hospital":
        return <Heart className="w-5 h-5" />;
      case "government":
        return <Building className="w-5 h-5" />;
      default:
        return <Phone className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Contact["type"]) => {
    switch (type) {
      case "internal":
        return "bg-primary-50 text-primary-600";
      case "police":
        return "bg-blue-50 text-blue-600";
      case "fire":
        return "bg-danger-50 text-danger-600";
      case "hospital":
        return "bg-success-50 text-success-600";
      case "government":
        return "bg-purple-50 text-purple-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const quickDial = [
    { type: "police" as const, name: "报警电话", number: "110", color: "bg-blue-500" },
    { type: "fire" as const, name: "火警电话", number: "119", color: "bg-danger-500" },
    { type: "hospital" as const, name: "急救电话", number: "120", color: "bg-success-500" },
  ];

  const typeCounts = {
    internal: contacts.filter((c) => c.type === "internal").length,
    police: contacts.filter((c) => c.type === "police").length,
    fire: contacts.filter((c) => c.type === "fire").length,
    hospital: contacts.filter((c) => c.type === "hospital").length,
    government: contacts.filter((c) => c.type === "government").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">应急联系人</h1>
          <p className="text-slate-500 mt-1">内部及外部应急联系方式</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickDial.map((item) => (
          <button
            key={item.number}
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "p-4 rounded-xl text-white group-hover:scale-110 transition-transform",
                  item.color
                )}
              >
                <PhoneCall className="w-7 h-7" />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-500">{item.name}</p>
                <p className="text-2xl font-bold text-slate-800 font-mono">{item.number}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">联系方式分类</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {typeOptions.map((opt) => {
            const Icon = opt.icon;
            const count =
              opt.value === "all"
                ? contacts.length
                : typeCounts[opt.value as keyof typeof typeCounts];
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedType(opt.value)}
                className={cn(
                  "p-4 rounded-xl flex flex-col items-center gap-2 transition-all",
                  selectedType === opt.value
                    ? "bg-primary-50 border-2 border-primary-500"
                    : "bg-slate-50 border-2 border-transparent hover:bg-slate-100"
                )}
              >
                <div
                  className={cn(
                    "p-2.5 rounded-lg",
                    selectedType === opt.value
                      ? "bg-primary-100 text-primary-600"
                      : "bg-white text-slate-500"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                <span className="text-xs text-slate-500">{count}人</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">联系人列表</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索联系人..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56 h-9 pl-10 pr-4 rounded-lg bg-slate-100 border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={cn("p-3 rounded-xl", getTypeColor(contact.type))}>
                {getTypeIcon(contact.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-800 text-lg">{contact.name}</h4>
                <p className="text-sm text-slate-500 mt-0.5">{contact.position}</p>
                <p className="text-sm text-slate-600 mt-0.5">{contact.department}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4" />
                  <span className="font-mono text-sm font-medium">{contact.phone}</span>
                </div>
                <button className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors">
                  <PhoneCall className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredContacts.length === 0 && (
          <div className="col-span-full bg-white rounded-xl p-12 text-center text-slate-400 shadow-sm border border-slate-100">
            <Phone className="w-12 h-12 mx-auto mb-3" />
            <p>暂无符合条件的联系人</p>
          </div>
        )}
      </div>
    </div>
  );
}
