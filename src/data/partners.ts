/**
 * FALLBACK / SEED DATA
 *
 * Назначение файла:
 * – исторический источник данных
 * – ручной seed / сверка
 * – reference для миграций
 *
 * В РАНТАЙМЕ НЕ ИСПОЛЬЗУЕТСЯ,
 * если NEXT_PUBLIC_MEDIA_SOURCE = 'supabase'
 */

export interface PartnerSeed {
  name: string;
  url: string;
  logo: string; // filename в Supabase bucket `media`
}

export const partnersData: PartnerSeed[] =
  process.env.NEXT_PUBLIC_MEDIA_SOURCE === 'mock'
    ? [
        { name: "Фонд культурных инициатив", url: "https://фондкультурныхинициатив.рф", logo: "PFKI.jpg" },
        { name: "Светоцех", url: "https://светоцех.рф", logo: "SwetoZech.png" },
        { name: "Theatrum", url: "https://theatrum.center/", logo: "Theatrum.png" },
        { name: "Т Плюс", url: "https://www.tplusgroup.ru/", logo: "TPlus.png" },
        { name: "Зоопарк Екб", url: "https://xn--80ankoagi.xn--80acgfbsl1azdqr.xn--p1ai/", logo: "ZooEkb.png" },
        { name: "Музей Победы", url: "https://victorymuseum.ru", logo: "WikMuseum.png" },
        { name: "12 канал", url: "https://12-kanal.ru", logo: "12TV.png" },
        { name: "1 ОБЛ", url: "https://www.1obl.ru", logo: "1Obl.png" },
        { name: "ТВ21", url: "https://www.tv21.ru", logo: "21TV.png" },
        { name: "Алтай 24", url: "https://katun24.ru", logo: "Altay24TV.png" },
        { name: "АТВ", url: "https://vk.com/atv_asb", logo: "ATV.png" },
        { name: "Белгород 24", url: "https://www.belnovosti.ru/tel eканал-belgorod-24", logo: "BelgorodTV.png" },
        { name: "Дагестан", url: "https://rgvktv.ru", logo: "DagTV.png" },
        { name: "День 24", url: "https://vk.com/tvn163", logo: "Den24.png" },
        { name: "ТВ Экспресс", url: "https://tv-express.ru", logo: "ExpressTV.png" },
        { name: "ТВ-Губерния", url: "https://tv-gubernia.ru", logo: "GuberniaTV.png" },
        { name: "НТС_Иркутск", url: "https://nts-tv.ru", logo: "NTS.png" },
        { name: "Кубань 24", url: "https://kuban24.tv", logo: "kuban24.png" },
        { name: "Липецк24", url: "https://lipetsktime.ru", logo: "lipetsk_time.jpg" },
        { name: "Курган ТВ", url: "https://oblast45.ru", logo: "KurganTV.png" },
        { name: "Миг ТВ", url: "https://tvmig.ru", logo: "MigTV.png" },
        { name: "Липецк24", url: "https://lipetsktime.ru/channels/lipetsk-24", logo: "Lipetsk24.png" },
        { name: "Мир звезд", url: "https://vk.com/mirzvezd_rf", logo: "mir_zvezd.png" },
        { name: "НВК Саха", url: "https://nvk-online.ru", logo: "NVK_sakha.png" },
        { name: "НСК49", url: "https://nsk49.ru", logo: "NSK49.png" },
        { name: "ОТР", url: "https://otr-online.ru", logo: "OTR.png" },
        { name: "ОТВ Челябинск", url: "https://1obl.tv", logo: "OTV_Chel.png" },
        { name: "ОТВ Екатеринбург", url: "https://obltv.ru", logo: "OTV_ekb.png" },
        { name: "ОТВ Прим", url: "https://otvprim.tv", logo: "OTV_Prim.png" },
        { name: "Первоуральск", url: "https://vk.com/tv_pervouralsk", logo: "PervouralskTV.png" },
        { name: "Почта России", url: "https://www.pochta.ru", logo: "PostRussia.jpg" },
        { name: "Сахалин Онлайн", url: "https://sakh.online", logo: "sakh_online.png" },
        { name: "Саратов 24", url: "https://saratov24.ru", logo: "Saratov24.png" },
        { name: "Севастополь ТВ", url: "https://sevtrk.ru", logo: "SewastopolTV.png" },
        { name: "Сочи 24", url: "https://sochi24.tv", logo: "Sochi24TV.png" },
        { name: "ТВ СПб", url: "https://tvspb.ru", logo: "SPBTV.png" },
        { name: "ОТС Новосибирск", url: "https://otstv.ru", logo: "OTS.png" },
        { name: "СвоёТВ", url: "https://stv24.tv", logo: "StavropolTV.png" },
        { name: "СВХ", url: "https://svx.company", logo: "svx_logistics.png" },
        { name: "Тюмень-ТВ", url: "https://tyumen-time.ru", logo: "TumenTime.png" },
        { name: "Югра ТВ", url: "https://ugra-tv.ru", logo: "Ugra.png" },
        { name: "VOIR fest", url: "https://t.me/voir_fest", logo: "VOIR.png" },
        { name: "Русский север", url: "https://rusevertv.ru", logo: "VologdaTV.png" },
        { name: "Ярославль Город ТВ", url: "https://www.gtk.tv", logo: "yaroslavl_tv.png" },
        { name: "Забайкалье ТВ", url: "https://zrtk.ru", logo: "ZabTV.png" },
      ]
    : [];
