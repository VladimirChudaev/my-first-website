-- Fill partner URLs from legacy partners.ts
-- Affects only media.category = 'partner'

-- 1. Обновить URL для известных файлов-партнеров
UPDATE public.media
SET url = v.url
FROM (
  VALUES
    ('PFKI.jpg', 'https://фондкультурныхинициатив.рф'),
    ('SwetoZech.png', 'https://светоцех.рф'),
    ('Theatrum.png', 'https://theatrum.center/'),
    ('TPlus.png', 'https://www.tplusgroup.ru/'),
    ('ZooEkb.png', 'https://xn--80ankoagi.xn--80acgfbsl1azdqr.xn--p1ai/'),
    ('WikMuseum.png', 'https://victorymuseum.ru'),
    ('12TV.png', 'https://12-kanal.ru'),
    ('1Obl.png', 'https://www.1obl.ru'),
    ('21TV.png', 'https://www.tv21.ru'),
    ('Altay24TV.png', 'https://katun24.ru'),
    ('ATV.png', 'https://vk.com/atv_asb'),
    ('BelgorodTV.png', 'https://www.belnovosti.ru/telekanal-belgorod-24'),
    ('DagTV.png', 'https://rgvktv.ru'),
    ('Den24.png', 'https://vk.com/tvn163'),
    ('ExpressTV.png', 'https://tv-express.ru'),
    ('GuberniaTV.png', 'https://tv-gubernia.ru'),
    ('NTS.png', 'https://nts-tv.ru'),
    ('kuban24.png', 'https://kuban24.tv'),
    ('lipetsk_time.jpg', 'https://lipetsktime.ru'),
    ('KurganTV.png', 'https://oblast45.ru'),
    ('MigTV.png', 'https://tvmig.ru'),
    ('Lipetsk24.png', 'https://lipetsktime.ru/channels/lipetsk-24'),
    ('mir_zvezd.png', 'https://vk.com/mirzvezd_rf'),
    ('NVK_sakha.png', 'https://nvk-online.ru'),
    ('NSK49.png', 'https://nsk49.ru'),
    ('OTR.png', 'https://otr-online.ru'),
    ('OTV_Chel.png', 'https://1obl.tv'),
    ('OTV_ekb.png', 'https://obltv.ru'),
    ('OTV_Prim.png', 'https://otvprim.tv'),
    ('PervouralskTV.png', 'https://vk.com/tv_pervouralsk'),
    ('PostRussia.jpg', 'https://www.pochta.ru'),
    ('sakh_online.png', 'https://sakh.online'),
    ('Saratov24.png', 'https://saratov24.ru'),
    ('SewastopolTV.png', 'https://sevtrk.ru'),
    ('Sochi24TV.png', 'https://sochi24.tv'),
    ('SPBTV.png', 'https://tvspb.ru'),
    ('OTS.png', 'https://otstv.ru'),
    ('StavropolTV.png', 'https://stv24.tv'),
    ('svx_logistics.png', 'https://svx.company'),
    ('TumenTime.png', 'https://tyumen-time.ru'),
    ('Ugra.png', 'https://ugra-tv.ru'),
    ('VOIR.png', 'https://t.me/voir_fest'),
    ('VologdaTV.png', 'https://rusevertv.ru'),
    ('yaroslavl_tv.png', 'https://www.gtk.tv'),
    ('ZabTV.png', 'https://zrtk.ru')
) AS v(filename, url)
WHERE media.filename = v.filename
  AND media.category = 'partner';

-- 2. Заполнить пустой строкой остальных партнеров (без NULL)
UPDATE public.media
SET url = ''
WHERE category = 'partner' 
  AND url IS NULL;