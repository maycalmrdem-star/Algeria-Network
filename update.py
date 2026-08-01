import re

with open('src/components/admin/BotConfigSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add states
state_injections = """
  const [autoresponder, setAutoresponder] = useState({ enabled: false, responses: [] });
  const [leveling, setLeveling] = useState({ enabled: false, levelUpMessage: 'Congratulations [user], you leveled up to level [level]!', levelUpChannelId: '' });
  const [autoroles, setAutoroles] = useState({ enabled: false, roleIds: '' });
  const [colors, setColors] = useState({ enabled: false });
  const [selfroles, setSelfroles] = useState({ enabled: false, channelId: '' });
  const [starboard, setStarboard] = useState({ enabled: false, channelId: '', starCount: 3 });
  const [tempchannels, setTempchannels] = useState({ enabled: false, categoryId: '', setupChannelId: '' });
  const [templinks, setTemplinks] = useState({ enabled: false, channelId: '', maxUses: 1, expiresIn: 86400 });
  const [modlogs, setModlogs] = useState({ enabled: false, channelId: '' });
  const [antiraid, setAntiraid] = useState({ enabled: false, action: 'kick', threshold: 5, timeWindow: 10 });
  const [vip, setVip] = useState({ enabled: false, roleIds: '' });
  const [notifications, setNotifications] = useState({ twitchEnabled: false, twitchChannel: '', youtubeEnabled: false, youtubeChannel: '', kickEnabled: false, kickChannel: '', redditEnabled: false, redditChannel: '', notifyChannelId: '', messageTemp: '[streamer] is now live!' });
"""
content = re.sub(
    r'(const \[tickets, setTickets\] = useState\(\{[\s\S]*?\}\);)',
    r'\1\n' + state_injections,
    content
)

# 2. Update fetchConfig
fetch_injections = """
      if (data.autoresponder) setAutoresponder(data.autoresponder);
      if (data.leveling) setLeveling(data.leveling);
      if (data.autoroles) setAutoroles({ ...data.autoroles, roleIds: data.autoroles.roleIds?.join(', ') || '' });
      if (data.colors) setColors(data.colors);
      if (data.selfroles) setSelfroles(data.selfroles);
      if (data.starboard) setStarboard(data.starboard);
      if (data.tempchannels) setTempchannels(data.tempchannels);
      if (data.templinks) setTemplinks(data.templinks);
      if (data.modlogs) setModlogs(data.modlogs);
      if (data.antiraid) setAntiraid(data.antiraid);
      if (data.vip) setVip({ ...data.vip, roleIds: data.vip.roleIds?.join(', ') || '' });
      if (data.notifications) setNotifications(data.notifications);
"""
content = re.sub(
    r'(if \(data.commands\) setCommands\(data.commands\);)',
    r'\1\n' + fetch_injections,
    content
)

# 3. Update saveConfig
save_injections = """
      if (type === 'autoroles' || type === 'vip') {
        payload = { ...data, roleIds: data.roleIds.split(',').map((id: string) => id.trim()).filter(Boolean) };
      }
"""
content = re.sub(
    r'(if \(type === \'automod\'\) \{[\s\S]*?\})',
    r'\1\n' + save_injections,
    content
)

# 4. Inject views
views_injections = """
      {activeSection === 'autoresponder' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6"><h3 className="text-xl font-bold text-white mb-2">الرد التلقائي</h3></div>
          <Toggle label="تفعيل الرد التلقائي" checked={autoresponder.enabled} onChange={(e: any) => setAutoresponder({...autoresponder, enabled: e.target.checked})} />
          <SaveButton loading={loading} onClick={() => saveConfig('autoresponder', autoresponder)} />
        </motion.div>
      )}
      {activeSection === 'leveling' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6"><h3 className="text-xl font-bold text-white mb-2">نظام المستويات</h3></div>
          <Toggle label="تفعيل نظام المستويات" checked={leveling.enabled} onChange={(e: any) => setLeveling({...leveling, enabled: e.target.checked})} />
          {leveling.enabled && (
             <>
               <Input label="رسالة الترقية" value={leveling.levelUpMessage} onChange={(e: any) => setLeveling({...leveling, levelUpMessage: e.target.value})} />
               <Input label="روم الترقيات (Channel ID)" value={leveling.levelUpChannelId} onChange={(e: any) => setLeveling({...leveling, levelUpChannelId: e.target.value})} />
             </>
          )}
          <SaveButton loading={loading} onClick={() => saveConfig('leveling', leveling)} />
        </motion.div>
      )}
      {activeSection === 'autoroles' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6"><h3 className="text-xl font-bold text-white mb-2">الرتب التلقائية</h3></div>
          <Toggle label="تفعيل الرتب التلقائية" checked={autoroles.enabled} onChange={(e: any) => setAutoroles({...autoroles, enabled: e.target.checked})} />
          {autoroles.enabled && (
             <Input label="الرتب (افصل بينها بفاصلة Role IDs)" value={autoroles.roleIds} onChange={(e: any) => setAutoroles({...autoroles, roleIds: e.target.value})} />
          )}
          <SaveButton loading={loading} onClick={() => saveConfig('autoroles', autoroles)} />
        </motion.div>
      )}
      {activeSection === 'colors' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6"><h3 className="text-xl font-bold text-white mb-2">الألوان</h3></div>
          <Toggle label="تفعيل الألوان" checked={colors.enabled} onChange={(e: any) => setColors({...colors, enabled: e.target.checked})} />
          <SaveButton loading={loading} onClick={() => saveConfig('colors', colors)} />
        </motion.div>
      )}
      {activeSection === 'selfroles' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6"><h3 className="text-xl font-bold text-white mb-2">رتب اختيارية</h3></div>
          <Toggle label="تفعيل الرتب الاختيارية" checked={selfroles.enabled} onChange={(e: any) => setSelfroles({...selfroles, enabled: e.target.checked})} />
          <SaveButton loading={loading} onClick={() => saveConfig('selfroles', selfroles)} />
        </motion.div>
      )}
      {activeSection === 'starboard' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6"><h3 className="text-xl font-bold text-white mb-2">نجمة (Starboard)</h3></div>
          <Toggle label="تفعيل نجمة" checked={starboard.enabled} onChange={(e: any) => setStarboard({...starboard, enabled: e.target.checked})} />
          {starboard.enabled && (
             <>
               <Input label="روم النجمة (Channel ID)" value={starboard.channelId} onChange={(e: any) => setStarboard({...starboard, channelId: e.target.value})} />
               <Input label="عدد النجمات المطلوب" value={starboard.starCount} onChange={(e: any) => setStarboard({...starboard, starCount: e.target.value})} />
             </>
          )}
          <SaveButton loading={loading} onClick={() => saveConfig('starboard', starboard)} />
        </motion.div>
      )}
      {activeSection === 'tempchannels' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6"><h3 className="text-xl font-bold text-white mb-2">رومات مؤقتة</h3></div>
          <Toggle label="تفعيل الرومات المؤقتة" checked={tempchannels.enabled} onChange={(e: any) => setTempchannels({...tempchannels, enabled: e.target.checked})} />
          {tempchannels.enabled && (
             <>
               <Input label="كاتيجوري الرومات (Category ID)" value={tempchannels.categoryId} onChange={(e: any) => setTempchannels({...tempchannels, categoryId: e.target.value})} />
               <Input label="روم إنشاء الرومات (Setup Channel ID)" value={tempchannels.setupChannelId} onChange={(e: any) => setTempchannels({...tempchannels, setupChannelId: e.target.value})} />
             </>
          )}
          <SaveButton loading={loading} onClick={() => saveConfig('tempchannels', tempchannels)} />
        </motion.div>
      )}
      {activeSection === 'templinks' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6"><h3 className="text-xl font-bold text-white mb-2">رابط مؤقت</h3></div>
          <Toggle label="تفعيل الروابط المؤقتة" checked={templinks.enabled} onChange={(e: any) => setTemplinks({...templinks, enabled: e.target.checked})} />
          <SaveButton loading={loading} onClick={() => saveConfig('templinks', templinks)} />
        </motion.div>
      )}
      {activeSection === 'modlogs' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6"><h3 className="text-xl font-bold text-white mb-2">Actions éffectués (Mod Logs)</h3></div>
          <Toggle label="تفعيل سجل المشرفين" checked={modlogs.enabled} onChange={(e: any) => setModlogs({...modlogs, enabled: e.target.checked})} />
          {modlogs.enabled && (
             <Input label="روم السجل (Channel ID)" value={modlogs.channelId} onChange={(e: any) => setModlogs({...modlogs, channelId: e.target.value})} />
          )}
          <SaveButton loading={loading} onClick={() => saveConfig('modlogs', modlogs)} />
        </motion.div>
      )}
      {activeSection === 'antiraid' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6"><h3 className="text-xl font-bold text-white mb-2">Anti-Raid</h3></div>
          <Toggle label="تفعيل الحماية من الريد" checked={antiraid.enabled} onChange={(e: any) => setAntiraid({...antiraid, enabled: e.target.checked})} />
          <SaveButton loading={loading} onClick={() => saveConfig('antiraid', antiraid)} />
        </motion.div>
      )}
      {activeSection === 'vip' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6"><h3 className="text-xl font-bold text-white mb-2">Protection VIP</h3></div>
          <Toggle label="تفعيل حماية الشخصيات المهمة" checked={vip.enabled} onChange={(e: any) => setVip({...vip, enabled: e.target.checked})} />
          {vip.enabled && (
             <Input label="الرتب المهمة (افصل بينها بفاصلة Role IDs)" value={vip.roleIds} onChange={(e: any) => setVip({...vip, roleIds: e.target.value})} />
          )}
          <SaveButton loading={loading} onClick={() => saveConfig('vip', vip)} />
        </motion.div>
      )}
      
      {['twitch', 'youtube', 'kick', 'reddit'].includes(activeSection) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-6"><h3 className="text-xl font-bold text-white mb-2 capitalize">إشعارات {activeSection}</h3></div>
          {activeSection === 'twitch' && (
            <>
              <Toggle label="تفعيل إشعارات تويتش" checked={notifications.twitchEnabled} onChange={(e: any) => setNotifications({...notifications, twitchEnabled: e.target.checked})} />
              {notifications.twitchEnabled && <Input label="اسم قناة تويتش" value={notifications.twitchChannel} onChange={(e: any) => setNotifications({...notifications, twitchChannel: e.target.value})} dir="ltr" />}
            </>
          )}
          {activeSection === 'youtube' && (
            <>
              <Toggle label="تفعيل إشعارات يوتيوب" checked={notifications.youtubeEnabled} onChange={(e: any) => setNotifications({...notifications, youtubeEnabled: e.target.checked})} />
              {notifications.youtubeEnabled && <Input label="رابط قناة يوتيوب" value={notifications.youtubeChannel} onChange={(e: any) => setNotifications({...notifications, youtubeChannel: e.target.value})} dir="ltr" />}
            </>
          )}
          {activeSection === 'kick' && (
            <>
              <Toggle label="تفعيل إشعارات Kick" checked={notifications.kickEnabled} onChange={(e: any) => setNotifications({...notifications, kickEnabled: e.target.checked})} />
              {notifications.kickEnabled && <Input label="اسم قناة Kick" value={notifications.kickChannel} onChange={(e: any) => setNotifications({...notifications, kickChannel: e.target.value})} dir="ltr" />}
            </>
          )}
          {activeSection === 'reddit' && (
            <>
              <Toggle label="تفعيل إشعارات Reddit" checked={notifications.redditEnabled} onChange={(e: any) => setNotifications({...notifications, redditEnabled: e.target.checked})} />
              {notifications.redditEnabled && <Input label="اسم Subreddit" value={notifications.redditChannel} onChange={(e: any) => setNotifications({...notifications, redditChannel: e.target.value})} dir="ltr" />}
            </>
          )}
          
          <Input label="روم الإشعارات (Channel ID)" value={notifications.notifyChannelId} onChange={(e: any) => setNotifications({...notifications, notifyChannelId: e.target.value})} />
          <Input label="قالب الرسالة" value={notifications.messageTemp} onChange={(e: any) => setNotifications({...notifications, messageTemp: e.target.value})} dir="ltr" />
          
          <SaveButton loading={loading} onClick={() => saveConfig('notifications', notifications)} />
        </motion.div>
      )}
"""

content = re.sub(
    r'(\{/\* Fallback for unused or premium modules \*/\})',
    views_injections + r'\n      \1',
    content
)

# 5. Fix the fallback array to include new items so the fallback screen doesn't show
fallback_arr = "['automod', 'welcome', 'tickets', 'commands', 'events', 'autoresponder', 'leveling', 'autoroles', 'colors', 'selfroles', 'starboard', 'tempchannels', 'templinks', 'modlogs', 'antiraid', 'vip', 'twitch', 'youtube', 'kick', 'reddit', 'overview', 'embeds', 'statistics', 'moderation']"
content = re.sub(
    r'!\[\'automod\', \'welcome\', \'tickets\', \'commands\', \'events\'\]\.includes',
    r'!' + fallback_arr + '.includes',
    content
)

with open('src/components/admin/BotConfigSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
