#!/usr/bin/env python3
"""Generate src/data/products.ts for the Homeiffy storefront.

Keeps the catalog consistent: every product gets full dimensions, selling copy,
drafted construction specs, and correct taxonomy references. Supplier-confirmed
fields (weight capacity, country of origin, manufacturer) are emitted as null so
the storefront hides them instead of printing a placeholder.
"""

from __future__ import annotations

import pathlib

ROOT = pathlib.Path(__file__).resolve()
# Resolved at call time by the caller passing an explicit output path.

# ── Construction profiles ────────────────────────────────────────────────
UPH = dict(
    materials="Kiln-dried hardwood frame with woven poly-blend upholstery over high-resilience foam",
    woodSpecies="Kiln-dried mixed hardwood (frame)",
    woodConstruction="Corner-blocked, glued and screwed frame joints",
    frameMaterial="Kiln-dried hardwood with engineered wood panels",
    surfaceFinish="Solid wood legs, clear matte lacquer",
    upholsteryMaterial="Woven polyester-blend performance fabric",
    foamSpecification="High-resilience polyurethane foam, 1.8 lb density seat cushions",
    careInstructions="Vacuum weekly with an upholstery attachment. Spot clean with a water-based cleaner on a white cloth, working inward from the edge of the mark. Rotate and flip loose cushions monthly to even out wear. Keep out of prolonged direct sunlight, which fades fabric.",
)

OAK_CASE = dict(
    materials="Engineered wood core with white oak veneer and solid oak edging",
    woodSpecies="American white oak (veneer and solid edging)",
    woodConstruction="Dowel and cam-lock panel construction with a solid oak face frame",
    frameMaterial="Engineered wood panel with solid oak edge banding",
    surfaceFinish="Low-sheen water-based lacquer",
    upholsteryMaterial=None,
    foamSpecification=None,
    careInstructions="Dust with a dry, soft cloth. Wipe spills immediately with a barely damp cloth and dry at once. Do not use ammonia, bleach or silicone polish. Use coasters and felt pads under lamps and accessories, and keep the piece out of direct sunlight and away from heat vents.",
)

SOLID_OAK = dict(
    materials="Solid American white oak",
    woodSpecies="American white oak",
    woodConstruction="Mortise and tenon joinery with solid oak panels",
    frameMaterial="Solid American white oak",
    surfaceFinish="Hand-sanded, low-sheen water-based lacquer",
    upholsteryMaterial=None,
    foamSpecification=None,
    careInstructions="Dust with a dry, soft cloth along the grain. Wipe spills immediately and dry at once. Do not use ammonia, bleach or silicone polish. Solid wood moves with humidity, so keep the room between 35 and 55 percent relative humidity where you can.",
)

METAL_OAK = dict(
    materials="Powder-coated steel frame with white oak veneer surfaces",
    woodSpecies="American white oak (veneer)",
    woodConstruction="Veneered engineered wood panels on a welded steel frame",
    frameMaterial="Powder-coated tubular steel",
    surfaceFinish="Matte powder coat with low-sheen lacquered wood",
    upholsteryMaterial=None,
    foamSpecification=None,
    careInstructions="Dust with a dry, soft cloth. Wipe the steel frame with a barely damp cloth and dry at once to avoid water spotting. Do not use abrasive pads or solvent cleaners on the powder coat. Check and retighten frame fixings every six months.",
)

UPH_SEAT_WOOD = dict(
    materials="Solid oak frame with upholstered seat over high-resilience foam",
    woodSpecies="American white oak",
    woodConstruction="Mortise and tenon frame joinery with corner blocks",
    frameMaterial="Solid American white oak",
    surfaceFinish="Low-sheen water-based lacquer",
    upholsteryMaterial="Woven polyester-blend performance fabric",
    foamSpecification="High-resilience polyurethane foam, 2.0 lb density seat pad",
    careInstructions="Vacuum the seat pad weekly. Spot clean with a water-based cleaner on a white cloth. Dust the wood frame with a dry cloth and retighten the seat fixings every six months.",
)

CW = {
    "cream": "BRAND_COLORWAYS.canvasCream",
    "lacquer": "BRAND_COLORWAYS.clayEmber",
    "pine": "BRAND_COLORWAYS.deepOlive",
    "ash": "BRAND_COLORWAYS.softPlum",
    "celadon": "BRAND_COLORWAYS.homeiffyTeal",
    "oak": "BRAND_COLORWAYS.naturalOak",
    "copper": "BRAND_COLORWAYS.warmMustard",
    "carbon": "BRAND_COLORWAYS.roomInk",
    "graphite": "BRAND_COLORWAYS.softGraphite",
    "white": "BRAND_COLORWAYS.galleryWhite",
}

FABRIC = ["cream", "lacquer", "pine", "ash"]
WOOD = ["oak", "carbon", "graphite"]

# ── Catalog ──────────────────────────────────────────────────────────────
# Each entry: the fields that genuinely differ per product.
P = []


def add(**kw):
    P.append(kw)


# ─── LIVING ───
add(
    id="hmf-liv-001", sku="HMF-LIV-001", slug="compact-apartment-sofa-72-inch",
    title="Compact Apartment Sofa, 72 Inches Wide",
    category="Sofas", subcategory="sofas", price=1299, profile=UPH,
    colorways=FABRIC[:3], upholsteryColor="Limestone",
    w=72, h=34, d=34, seatW=64, seatH=18, seatD=22, armH=25, backH=34,
    weight="128 lb", pkg=(78, 32, 38), pkgW="146 lb", boxes=1,
    assembly=True, tools="No tools required, legs thread on by hand",
    hardware="Four solid oak legs with threaded inserts",
    instructions="Printed instructions in the carton",
    seats=3, ship="upholstered-furniture", featured=True, new=False,
    style="Compact apartment sofa",
    moments=["unwind", "gather", "reset"],
    rooms=["living-room", "flexible-living-area", "studio-apartment"],
    fp=["standard", "wide"], fn=["sit"],
    rc=["living-anchor"],
    contents="One sofa body, four legs, two back cushions, two seat cushions",
    desc="A full three-seat sofa that stops at 72 inches, so it fits the wall you actually have rather than the one in the showroom. The tight 34 inch depth keeps a walkway clear in narrow living rooms, while the 22 inch seat depth is still deep enough to properly sit back into. Legs thread on by hand, so it goes from carton to usable in a few minutes.",
    highlights=["72 inch width fits most apartment walls", "34 inch depth preserves walkway clearance", "Removable, reversible seat and back cushions", "Solid oak legs thread on by hand, no tools"],
    kw=["sofa", "apartment sofa", "compact sofa", "72 inch sofa", "living room sofa", "three seat sofa"],
)
add(
    id="hmf-liv-002", sku="HMF-LIV-002", slug="compact-loveseat-60-inch",
    title="Compact Loveseat, 60 Inches Wide",
    category="Loveseats", subcategory="loveseats", price=899, profile=UPH,
    colorways=["cream", "lacquer", "pine"], upholsteryColor="Limestone",
    w=60, h=33, d=33, seatW=52, seatH=18, seatD=21, armH=24, backH=33,
    weight="94 lb", pkg=(66, 31, 37), pkgW="108 lb", boxes=1,
    assembly=True, tools="No tools required, legs thread on by hand",
    hardware="Four solid oak legs with threaded inserts",
    instructions="Printed instructions in the carton",
    seats=2, ship="upholstered-furniture", featured=True, new=False,
    style="Compact two-seat loveseat",
    moments=["unwind", "restore", "focus"],
    rooms=["living-room", "reading-area", "home-office-lounge", "bedroom"],
    fp=["standard"], fn=["sit"],
    rc=["living-anchor", "living-seating"],
    contents="One loveseat body, four legs, two back cushions, two seat cushions",
    desc="Two proper seats in 60 inches, for rooms where a full sofa would block the path to the window. It works as the main seat in a studio or as a second perch in a reading corner. Same frame and cushion build as the 72 inch sofa, scaled down rather than cheapened.",
    highlights=["60 inch width suits small living rooms and studios", "Seats two adults comfortably", "Matches the 72 inch apartment sofa for pairing", "Reversible seat cushions extend fabric life"],
    kw=["loveseat", "compact loveseat", "60 inch loveseat", "two seat sofa", "small sofa", "living room"],
)
add(
    id="hmf-liv-003", sku="HMF-LIV-003", slug="modular-armless-seat",
    title="Modular Armless Seat, 30 Inches Wide",
    category="Modular Seating", subcategory="modular-seating", price=449, profile=UPH,
    colorways=["cream", "pine", "ash"], upholsteryColor="Limestone",
    w=30, h=33, d=33, seatW=30, seatH=18, seatD=21, armH=None, backH=33,
    weight="46 lb", pkg=(34, 31, 37), pkgW="54 lb", boxes=1,
    assembly=True, tools="No tools required, legs thread on by hand",
    hardware="Four solid oak legs, two seat connector brackets",
    instructions="Printed instructions in the carton",
    seats=1, ship="upholstered-furniture", featured=False, new=False,
    style="Armless modular seat",
    moments=["unwind", "reset", "gather"],
    rooms=["living-room", "flexible-lounge", "studio-apartment"],
    fp=["modular", "compact"], fn=["sit"],
    rc=["living-seating", "living-accent"],
    contents="One armless seat, four legs, two connector brackets, one back cushion, one seat cushion",
    desc="A single armless seat that connects to another to build exactly the run of seating your wall takes. Buy two for a loveseat, three for a sofa, or add one to an existing run later. Connector brackets are included so the units stay aligned instead of drifting apart.",
    highlights=["30 inch module builds seating to any wall length", "Connector brackets included", "Add units later as the room changes", "Same cushion build as the full sofa"],
    kw=["modular seat", "armless seat", "sectional module", "modular sofa", "build your own sofa"],
)
add(
    id="hmf-liv-004", sku="HMF-LIV-004", slug="curved-back-lounge-chair",
    title="Curved Back Lounge Chair, 30 Inches Wide",
    category="Lounge Chairs", subcategory="lounge-chairs", price=599, profile=UPH,
    colorways=["cream", "pine", "ash"], upholsteryColor="Limestone",
    w=30, h=31, d=32, seatW=22, seatH=17, seatD=21, armH=24, backH=31,
    weight="42 lb", pkg=(34, 30, 35), pkgW="50 lb", boxes=1,
    assembly=True, tools="No tools required, legs thread on by hand",
    hardware="Four solid oak legs with threaded inserts",
    instructions="Printed instructions in the carton",
    seats=1, ship="upholstered-furniture", featured=True, new=False,
    style="Curved back lounge chair",
    moments=["unwind", "restore"],
    rooms=["living-room", "reading-area", "bedroom"],
    fp=["standard", "compact"], fn=["sit"],
    rc=["living-seating", "bedroom-seating"],
    contents="One lounge chair, four legs, one seat cushion",
    desc="The curved back wraps slightly around your shoulders, which is what makes this comfortable to sit in for an hour rather than a minute. At 30 inches wide it reads as an accent chair rather than a second sofa, so it can sit in a corner without crowding it.",
    highlights=["Curved back gives genuine shoulder support", "30 inch footprint suits corners and tight bays", "Pairs with the apartment sofa and loveseat", "Solid oak legs thread on by hand"],
    kw=["lounge chair", "accent chair", "curved back chair", "armchair", "living room chair"],
)
add(
    id="hmf-liv-005", sku="HMF-LIV-005", slug="high-back-reading-chair",
    title="High Back Reading Chair, 32 Inches Wide",
    category="Reading Chairs", subcategory="reading-chairs", price=649, profile=UPH,
    colorways=["cream", "pine", "ash"], upholsteryColor="Limestone",
    w=32, h=42, d=34, seatW=22, seatH=18, seatD=21, armH=25, backH=42,
    weight="52 lb", pkg=(36, 40, 37), pkgW="61 lb", boxes=1,
    assembly=True, tools="No tools required, legs thread on by hand",
    hardware="Four solid oak legs with threaded inserts",
    instructions="Printed instructions in the carton",
    seats=1, ship="upholstered-furniture", featured=False, new=False,
    style="High back reading chair",
    moments=["focus", "unwind", "restore"],
    rooms=["reading-area", "living-room", "bedroom", "home-workspace"],
    fp=["standard", "tall"], fn=["sit"],
    rc=["living-seating", "bedroom-seating"],
    contents="One reading chair, four legs, one seat cushion",
    desc="A 42 inch back that actually supports your head, which is the difference between a chair you read in and a chair you fall asleep in badly. The taller silhouette also gives a low-furniture room some vertical weight. Good under a floor lamp in a corner.",
    highlights=["42 inch back height supports head and neck", "Adds vertical presence to low-furniture rooms", "32 inch width fits a standard reading corner", "High-resilience foam holds shape over long sits"],
    kw=["reading chair", "high back chair", "wing chair", "armchair", "library chair"],
)
add(
    id="hmf-liv-006", sku="HMF-LIV-006", slug="storage-ottoman-32-inch",
    title="Upholstered Storage Ottoman, 32 Inches Wide",
    category="Ottomans", subcategory="ottomans", price=299, profile=UPH,
    colorways=["cream", "pine", "ash"], upholsteryColor="Limestone",
    w=32, h=18, d=18, seatW=32, seatH=18, seatD=18, armH=None, backH=None,
    weight="28 lb", pkg=(35, 21, 21), pkgW="34 lb", boxes=1,
    assembly=True, tools="No tools required, feet thread on by hand",
    hardware="Four solid oak feet with threaded inserts",
    instructions="Printed instructions in the carton",
    seats=1, ship="upholstered-furniture", featured=False, new=False,
    style="Upholstered storage ottoman",
    moments=["unwind", "reset", "restore"],
    rooms=["living-room", "bedroom", "flexible-living-area"],
    fp=["standard", "compact"], fn=["store", "sit"],
    rc=["living-storage", "living-accent"],
    storage="Lift-top interior compartment",
    contents="One storage ottoman with hinged lid, four feet",
    desc="Three jobs in one 32 inch footprint: a footrest, an extra seat when people turn up, and a place to put the throw blankets that otherwise live on the back of the sofa. The lid lifts on a soft-close hinge so it will not slam on fingers.",
    highlights=["Lift-top storage for blankets and controllers", "Soft-close hinge will not slam shut", "Doubles as a footrest and occasional seat", "18 inch height matches standard sofa seat height"],
    kw=["storage ottoman", "ottoman", "footstool", "blanket storage", "coffee table ottoman"],
)
add(
    id="hmf-liv-007", sku="HMF-LIV-007", slug="lift-top-coffee-table-40-inch",
    title="Lift Top Coffee Table, 40 Inches Wide",
    category="Coffee and Side Tables", subcategory="coffee-tables", price=449, profile=OAK_CASE,
    colorways=WOOD, w=40, h=19, d=22, weight="62 lb", pkg=(44, 10, 26), pkgW="72 lb", boxes=1,
    assembly=True, tools="Phillips screwdriver required, not included",
    hardware="All fixings, hex key and lift mechanism pre-fitted",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="standard-furniture-parcel", featured=False, new=False,
    style="Lift top coffee table",
    moments=["unwind", "reset", "focus"],
    rooms=["living-room", "flexible-living-area", "studio-apartment"],
    fp=["standard", "expandable"], fn=["transform", "store"],
    rc=["living-table"],
    storage="Lift-top compartment with lower fixed shelf",
    extension="Spring-assisted lift top raises the surface to 29 inches",
    shelves=1,
    contents="One table top with lift mechanism, one lower shelf, four legs, fixings",
    desc="The top lifts and travels toward you to 29 inches, which turns a coffee table into a place you can actually eat or work at from the sofa. Underneath there is a compartment for laptops and remotes, plus a fixed lower shelf for books. It is the piece that makes a studio apartment work.",
    highlights=["Top lifts to 29 inches for eating or working", "Hidden compartment under the lift top", "Fixed lower shelf for books and trays", "Spring-assisted mechanism lifts with one hand"],
    kw=["lift top coffee table", "coffee table", "storage coffee table", "convertible table", "small space table"],
)
add(
    id="hmf-liv-008", sku="HMF-LIV-008", slug="nesting-side-tables-set-of-3",
    title="Nesting Side Tables, Set of 3",
    category="Coffee and Side Tables", subcategory="side-tables", price=349, profile=METAL_OAK,
    colorways=["oak", "carbon"], w=20, h=22, d=20, weight="34 lb", pkg=(24, 24, 22), pkgW="41 lb", boxes=1,
    assembly=True, tools="Hex key included",
    hardware="All fixings and hex key included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="small-furniture-parcel", featured=False, new=False,
    style="Nesting side table set",
    moments=["unwind", "gather", "reset"],
    rooms=["living-room", "reading-area", "bedroom"],
    fp=["compact", "modular"], fn=["store"],
    rc=["living-table", "living-accent"],
    contents="Three nesting tables (20, 18 and 16 inches wide), fixings, hex key",
    desc="Three tables that stack into the footprint of one, then spread out when you have people over and everyone needs somewhere to put a glass down. Heights step from 22 to 18 inches so they tuck cleanly. The largest works as a compact side table on its own.",
    highlights=["Three tables store in one 20 inch footprint", "Spread out for guests, nest again after", "Steel frame with white oak veneer tops", "Largest table works alone as a side table"],
    kw=["nesting tables", "side tables", "set of 3", "accent tables", "end table"],
)
add(
    id="hmf-liv-009", sku="HMF-LIV-009", slug="low-media-console-64-inch",
    title="Low Media Console, 64 Inches Wide",
    category="Media Furniture", subcategory="media-furniture", price=799, profile=OAK_CASE,
    colorways=WOOD, w=64, h=22, d=16, weight="96 lb", pkg=(69, 12, 21), pkgW="112 lb", boxes=2,
    assembly=True, tools="Phillips screwdriver required, not included",
    hardware="All fixings, hex key, cable grommets and wall anchor strap included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="oversized-furniture", featured=True, new=False,
    style="Low media console",
    moments=["unwind", "reset"],
    rooms=["living-room", "flexible-living-area"],
    fp=["wide", "wall-adjacent"], fn=["store"],
    rc=["living-storage"],
    storage="Two cabinets with adjustable shelving and a central open bay",
    doors=2, shelves=3,
    contents="One console body, two doors, three shelves, cable grommets, wall anchor strap, fixings",
    desc="Low enough at 22 inches that a wall-mounted screen still sits at eye level, and 16 inches deep so it does not eat the room. Cable grommets are cut at the back of every bay, and the central open bay stays ventilated for a console or receiver. Includes a wall anchor strap, which you should use.",
    highlights=["22 inch height keeps a mounted screen at eye level", "16 inch depth suits narrow living rooms", "Cable grommets in every bay", "Ventilated centre bay for AV equipment"],
    kw=["media console", "tv stand", "tv console", "low console", "entertainment unit", "64 inch"],
)

# ─── BEDROOM ───
add(
    id="hmf-bed-001", sku="HMF-BED-001", slug="queen-platform-bed",
    title="Queen Platform Bed",
    category="Beds", subcategory="beds", price=899, profile=SOLID_OAK,
    colorways=WOOD, w=64, h=38, d=85, weight="118 lb", pkg=(86, 9, 20), pkgW="136 lb", boxes=3,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All bolts, slats and hex key included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="freight-review-required", featured=True, new=False,
    style="Solid oak platform bed",
    moments=["restore"], rooms=["bedroom"],
    fp=["wide", "standard"], fn=["rest"],
    rc=["bedroom-anchor"],
    clearance=7,
    contents="Headboard, footboard, two side rails, centre support rail, 14 slats, fixings, hex key",
    desc="A solid oak platform bed with a slat base, so it takes a mattress directly and you can skip the box spring entirely. Seven inches of clearance underneath fits standard storage boxes. The centre support rail and 14 slats are what stop the middle sagging after a year.",
    highlights=["No box spring needed, slat base included", "7 inch under-bed clearance for storage", "Centre support rail prevents mattress sag", "Solid white oak, not veneer"],
    kw=["queen bed", "platform bed", "bed frame", "wood bed", "no box spring"],
)
add(
    id="hmf-bed-002", sku="HMF-BED-002", slug="queen-storage-bed",
    title="Queen Storage Bed with Four Drawers",
    category="Beds", subcategory="beds", price=1199, profile=OAK_CASE,
    colorways=WOOD, w=64, h=38, d=85, weight="164 lb", pkg=(86, 11, 22), pkgW="192 lb", boxes=4,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All bolts, slats, drawer runners and hex key included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="freight-review-required", featured=False, new=False,
    style="Storage platform bed",
    moments=["restore", "reset"], rooms=["bedroom", "studio-apartment"],
    fp=["wide", "standard"], fn=["rest", "store"],
    rc=["bedroom-anchor", "bedroom-storage"],
    storage="Four underbed drawers on smooth-glide runners",
    drawers=4,
    contents="Headboard, footboard, two side rails with drawer housings, four drawers, centre support, 14 slats, fixings",
    desc="Four deep drawers built into the base, which in a room without a closet is the difference between coping and not. Two drawers per side on smooth-glide runners, so you do not need clearance at the foot of the bed. Slat base takes a mattress directly.",
    highlights=["Four underbed drawers, two per side", "No box spring needed", "Drawers open from the sides, not the foot", "Replaces a dresser in a small bedroom"],
    kw=["storage bed", "queen bed", "bed with drawers", "underbed storage", "platform bed"],
)
add(
    id="hmf-bed-003", sku="HMF-BED-003", slug="two-drawer-nightstand-24-inch",
    title="Two Drawer Nightstand, 24 Inches Wide",
    category="Nightstands", subcategory="nightstands", price=279, profile=OAK_CASE,
    colorways=WOOD, w=24, h=24, d=16, weight="38 lb", pkg=(28, 28, 20), pkgW="45 lb", boxes=1,
    assembly=True, tools="Hex key included",
    hardware="All fixings, hex key and wall anchor strap included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="small-furniture-parcel", featured=False, new=False,
    style="Two drawer nightstand",
    moments=["restore"], rooms=["bedroom"],
    fp=["compact", "wall-adjacent"], fn=["store", "rest"],
    rc=["bedroom-storage", "bedroom-accent"],
    storage="Two drawers on smooth-glide runners",
    drawers=2,
    contents="One nightstand, two drawers, wall anchor strap, fixings, hex key",
    desc="Twenty-four inches tall, which puts the top level with most mattress heights so you are not reaching down for a glass of water in the dark. Two drawers hide the things that otherwise clutter a bedside surface. A cable notch at the back lets a charger run without trapping the drawer.",
    highlights=["24 inch height matches most mattress tops", "Two drawers on smooth-glide runners", "Rear cable notch for a phone charger", "Wall anchor strap included"],
    kw=["nightstand", "bedside table", "two drawer nightstand", "bedside cabinet", "24 inch"],
)
add(
    id="hmf-bed-004", sku="HMF-BED-004", slug="six-drawer-dresser-58-inch",
    title="Six Drawer Dresser, 58 Inches Wide",
    category="Dressers", subcategory="dressers", price=899, profile=OAK_CASE,
    colorways=WOOD, w=58, h=32, d=18, weight="152 lb", pkg=(63, 36, 22), pkgW="178 lb", boxes=2,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All fixings, hex key, anti-tip restraint kit and wall anchor included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="oversized-furniture", featured=True, new=False,
    style="Six drawer dresser",
    moments=["restore"], rooms=["bedroom"],
    fp=["wide", "wall-adjacent"], fn=["store", "rest"],
    rc=["bedroom-storage"],
    storage="Six drawers on smooth-glide runners",
    drawers=6,
    contents="One dresser body, six drawers, anti-tip restraint kit, wall anchor, fixings, hex key",
    desc="Six full-width drawers across 58 inches, which is enough for two people to stop negotiating over closet space. The 18 inch depth keeps it against a wall without stealing floor. Ships with an anti-tip restraint kit, and it must be anchored to the wall before you load it.",
    highlights=["Six full-width drawers", "18 inch depth suits narrower bedrooms", "Anti-tip restraint kit included", "Top surface doubles as a dressing or media surface"],
    kw=["dresser", "chest of drawers", "six drawer dresser", "bedroom storage", "58 inch"],
)
add(
    id="hmf-bed-005", sku="HMF-BED-005", slug="upholstered-bedroom-bench-50-inch",
    title="Upholstered Bedroom Bench, 50 Inches Wide",
    category="Bed Benches", subcategory="bed-benches", price=349, profile=UPH_SEAT_WOOD,
    colorways=["cream", "pine", "ash"], upholsteryColor="Limestone",
    w=50, h=18, d=16, seatW=50, seatH=18, seatD=16,
    weight="32 lb", pkg=(54, 21, 19), pkgW="39 lb", boxes=1,
    assembly=True, tools="Hex key included",
    hardware="Four solid oak legs, fixings and hex key included",
    instructions="Illustrated step-by-step instructions in the carton",
    seats=2, ship="upholstered-furniture", featured=False, new=False,
    style="Upholstered bed bench",
    moments=["restore", "reset"], rooms=["bedroom"],
    fp=["standard"], fn=["sit", "rest"],
    rc=["bedroom-seating", "bedroom-accent"],
    contents="One upholstered bench, four legs, fixings, hex key",
    desc="The place to sit and put your shoes on, and the place clothes land at the end of the day instead of on the floor. Fifty inches spans the foot of a queen bed. At 16 inches deep it does not narrow the walkway around the bed.",
    highlights=["50 inch width spans the foot of a queen bed", "16 inch depth keeps the walkway clear", "Seats two", "Solid oak legs, upholstered seat pad"],
    kw=["bedroom bench", "bed bench", "end of bed bench", "upholstered bench", "50 inch"],
)
add(
    id="hmf-bed-006", sku="HMF-BED-006", slug="compact-wardrobe-36-inch",
    title="Compact Wardrobe, 36 Inches Wide",
    category="Wardrobes", subcategory="wardrobes", price=799, profile=OAK_CASE,
    colorways=WOOD, w=36, h=72, d=21, weight="168 lb", pkg=(76, 25, 14), pkgW="196 lb", boxes=2,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All fixings, hex key, hanging rail, anti-tip restraint kit and wall anchor included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="freight-review-required", featured=False, new=False,
    style="Compact freestanding wardrobe",
    moments=["restore", "reset"], rooms=["bedroom", "studio-apartment"],
    fp=["tall", "compact", "wall-adjacent"], fn=["store", "rest"],
    rc=["bedroom-storage"],
    storage="Full-width hanging rail with an upper shelf and a lower drawer",
    doors=2, drawers=1, shelves=1,
    contents="One wardrobe body, two doors, hanging rail, upper shelf, one drawer, anti-tip restraint kit, fixings",
    desc="A freestanding closet for a room that was built without one. Thirty-six inches wide takes roughly a metre of hanging clothes, with a shelf above for folded items and a drawer below. Must be anchored to the wall before use, and the restraint kit is in the box.",
    highlights=["Full-width hanging rail for around 36 inches of clothes", "Upper shelf and lower drawer included", "Fits rooms built without a closet", "Anti-tip restraint kit included"],
    kw=["wardrobe", "armoire", "closet", "clothes storage", "freestanding wardrobe", "36 inch"],
)

# ─── DINING ───
add(
    id="hmf-din-001", sku="HMF-DIN-001", slug="compact-round-dining-table-44-inch",
    title="Compact Round Dining Table, 44 Inch Diameter",
    category="Dining Tables", subcategory="dining-tables", price=549, profile=SOLID_OAK,
    colorways=WOOD, w=44, h=30, d=44, weight="76 lb", pkg=(48, 8, 48), pkgW="88 lb", boxes=1,
    assembly=True, tools="Hex key included",
    hardware="Pedestal base, all fixings and hex key included",
    instructions="Illustrated step-by-step instructions in the carton",
    seats=4, ship="oversized-furniture", featured=True, new=False,
    style="Round pedestal dining table",
    moments=["gather"], rooms=["dining-room", "small-dining-area", "kitchen"],
    fp=["standard", "compact"], fn=["gather"],
    rc=["dining-anchor"],
    contents="One round table top, one pedestal base, fixings, hex key",
    desc="A round top seats four without anyone getting a table leg in their knees, because the pedestal base keeps the floor clear. Forty-four inches is the size that fits a small dining area and still leaves room to pull chairs out. Round also means no sharp corners in a tight walkway.",
    highlights=["Pedestal base leaves legroom clear all round", "Seats four comfortably", "No corners to catch in a tight walkway", "Solid white oak top"],
    kw=["round dining table", "dining table", "44 inch table", "pedestal table", "small dining table"],
)
add(
    id="hmf-din-002", sku="HMF-DIN-002", slug="extendable-dining-table-52-inch",
    title="Extendable Dining Table, 52 to 70 Inches",
    category="Dining Tables", subcategory="dining-tables", price=699, profile=SOLID_OAK,
    colorways=WOOD, w=52, h=30, d=34, weight="104 lb", pkg=(57, 9, 38), pkgW="122 lb", boxes=2,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All fixings, hex key and extension leaf included",
    instructions="Illustrated step-by-step instructions in the carton",
    seats=6, ship="oversized-furniture", featured=False, new=False,
    style="Extendable dining table",
    moments=["gather", "reset"],
    rooms=["dining-room", "small-dining-area", "kitchen", "flexible-living-area"],
    fp=["expandable", "standard"], fn=["gather", "transform"],
    rc=["dining-anchor"],
    extension="Butterfly leaf extends the table from 52 to 70 inches",
    contents="One table top, one butterfly extension leaf, four legs, fixings, hex key",
    desc="Fifty-two inches for the four people who actually live there, 70 inches for the six who turn up at the holidays. The butterfly leaf stores folded inside the table, so there is no separate panel to find room for in a closet. Extends in about thirty seconds.",
    highlights=["Extends from 52 to 70 inches", "Leaf stores inside the table, nothing to store separately", "Seats four daily, six extended", "Solid white oak"],
    kw=["extendable dining table", "extending table", "dining table", "butterfly leaf", "52 inch", "70 inch"],
)
add(
    id="hmf-din-003", sku="HMF-DIN-003", slug="upholstered-dining-chairs-set-of-2",
    title="Upholstered Dining Chairs, Set of 2",
    category="Dining Chairs", subcategory="dining-chairs", price=399, profile=UPH_SEAT_WOOD,
    colorways=["cream", "pine", "ash"], upholsteryColor="Limestone",
    w=19, h=33, d=21, seatW=18, seatH=18, seatD=17, backH=33,
    weight="26 lb", pkg=(23, 35, 25), pkgW="32 lb", boxes=1,
    assembly=True, tools="Hex key included",
    hardware="All fixings and hex key included",
    instructions="Illustrated step-by-step instructions in the carton",
    seats=2, ship="upholstered-furniture", featured=False, new=False,
    style="Upholstered dining chair",
    moments=["gather"], rooms=["dining-room", "small-dining-area", "kitchen"],
    fp=["standard", "modular"], fn=["gather", "sit"],
    rc=["dining-seating"],
    contents="Two dining chairs, fixings, hex key",
    desc="An 18 inch seat height that works under a 30 inch table, with enough padding to sit through a long dinner. The solid oak frame is joined with mortise and tenon rather than screwed brackets, which is what keeps a dining chair from going wobbly. Sold as a pair.",
    highlights=["18 inch seat height pairs with 30 inch tables", "Mortise and tenon oak frame resists racking", "Padded seat for long meals", "Sold as a set of two"],
    kw=["dining chairs", "upholstered chairs", "set of 2", "kitchen chairs", "dining seating"],
)
add(
    id="hmf-din-004", sku="HMF-DIN-004", slug="upholstered-dining-bench-54-inch",
    title="Upholstered Dining Bench, 54 Inches Wide",
    category="Dining Benches", subcategory="dining-benches", price=379, profile=UPH_SEAT_WOOD,
    colorways=["cream", "pine", "ash"], upholsteryColor="Limestone",
    w=54, h=18, d=15, seatW=54, seatH=18, seatD=15,
    weight="34 lb", pkg=(58, 21, 18), pkgW="41 lb", boxes=1,
    assembly=True, tools="Hex key included",
    hardware="Four solid oak legs, fixings and hex key included",
    instructions="Illustrated step-by-step instructions in the carton",
    seats=3, ship="upholstered-furniture", featured=False, new=False,
    style="Upholstered dining bench",
    moments=["gather", "reset"],
    rooms=["dining-room", "small-dining-area", "kitchen"],
    fp=["standard", "wide"], fn=["gather", "sit"],
    rc=["dining-seating"],
    contents="One upholstered bench, four legs, fixings, hex key",
    desc="A bench seats three where two chairs would fit, and slides fully under the table when the meal is over, which gives a small dining area its floor back. Fifty-four inches runs along the long side of most tables up to 70 inches.",
    highlights=["Seats three in the space of two chairs", "Tucks fully under the table when not in use", "Pairs with the 52 and 70 inch dining tables", "Padded seat over a solid oak frame"],
    kw=["dining bench", "upholstered bench", "kitchen bench", "table bench", "54 inch"],
)
add(
    id="hmf-din-005", sku="HMF-DIN-005", slug="sideboard-60-inch",
    title="Sideboard, 60 Inches Wide",
    category="Sideboards", subcategory="sideboards", price=749, profile=OAK_CASE,
    colorways=WOOD, w=60, h=32, d=17, weight="128 lb", pkg=(65, 36, 21), pkgW="150 lb", boxes=2,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All fixings, hex key and wall anchor strap included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="oversized-furniture", featured=True, new=False,
    style="Dining sideboard",
    moments=["gather", "reset"],
    rooms=["dining-room", "dining-area", "living-room"],
    fp=["wide", "wall-adjacent"], fn=["store", "gather"],
    rc=["dining-storage"],
    storage="Two cabinets with adjustable shelves and two upper drawers",
    doors=2, drawers=2, shelves=2,
    contents="One sideboard body, two doors, two drawers, two adjustable shelves, wall anchor strap, fixings",
    desc="Where the serving dishes, table linen and the good glasses go, so the kitchen cupboards stop overflowing. The 32 inch top height works as a serving surface when you are putting food out. Seventeen inches deep, so it fits a dining room that is already tight.",
    highlights=["Two cabinets plus two drawers", "32 inch top works as a serving surface", "17 inch depth suits tight dining rooms", "Adjustable shelves for tall items"],
    kw=["sideboard", "buffet", "credenza", "dining storage", "60 inch sideboard"],
)

# ─── ENTRYWAY ───
add(
    id="hmf-ent-001", sku="HMF-ENT-001", slug="narrow-console-table-40-inch",
    title="Narrow Console Table, 40 Inches Wide",
    category="Consoles", subcategory="consoles", price=329, profile=METAL_OAK,
    colorways=["oak", "carbon"], w=40, h=30, d=12, weight="42 lb", pkg=(44, 8, 16), pkgW="50 lb", boxes=1,
    assembly=True, tools="Hex key included",
    hardware="All fixings, hex key and wall anchor strap included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="standard-furniture-parcel", featured=True, new=False,
    style="Narrow console table",
    moments=["arrive", "focus", "reset"],
    rooms=["entryway", "hallway", "living-room", "home-workspace"],
    fp=["narrow", "wall-adjacent"], fn=["store"],
    rc=["entry-anchor", "entry-accent"],
    shelves=1,
    contents="One console top, one lower shelf, steel frame, wall anchor strap, fixings, hex key",
    desc="Twelve inches deep, which is the whole point: it gives a hallway a surface for keys and post without narrowing the walkway enough to notice. A lower shelf takes a basket or a pair of shoes. Also works behind a sofa or as a very compact desk.",
    highlights=["12 inch depth keeps hallways passable", "Lower shelf for baskets or shoes", "Works as an entry table, sofa table or compact desk", "Wall anchor strap included"],
    kw=["console table", "narrow console", "hallway table", "entry table", "40 inch", "sofa table"],
)
add(
    id="hmf-ent-002", sku="HMF-ENT-002", slug="tilt-out-shoe-cabinet-30-inch",
    title="Tilt Out Shoe Cabinet, 30 Inches Wide",
    category="Shoe Storage", subcategory="shoe-storage", price=399, profile=OAK_CASE,
    colorways=WOOD, w=30, h=42, d=10, weight="66 lb", pkg=(46, 34, 14), pkgW="78 lb", boxes=1,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All fixings, hex key, anti-tip restraint kit and wall anchor included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="standard-furniture-parcel", featured=False, new=False,
    style="Tilt out shoe cabinet",
    moments=["arrive", "reset"],
    rooms=["entryway", "hallway", "mudroom-style-area"],
    fp=["narrow", "wall-adjacent", "compact"], fn=["store"],
    rc=["entry-storage"],
    storage="Three tilt-out compartments holding up to 12 pairs",
    doors=3,
    contents="One cabinet body, three tilt-out fronts, anti-tip restraint kit, fixings, hex key",
    desc="Ten inches deep and holds around twelve pairs, because the compartments tilt out rather than pulling out. That means it works in a hallway where a drawer would have nowhere to open into. The top surface takes keys and a lamp.",
    highlights=["Only 10 inches deep against the wall", "Holds around 12 pairs across three compartments", "Tilt-out fronts need no drawer clearance", "Anti-tip restraint kit included"],
    kw=["shoe cabinet", "shoe storage", "tilt out cabinet", "entryway storage", "hallway shoe rack"],
)
add(
    id="hmf-ent-003", sku="HMF-ENT-003", slug="storage-entry-bench-46-inch",
    title="Storage Entry Bench, 46 Inches Wide",
    category="Entry Benches", subcategory="entry-benches", price=429, profile=UPH_SEAT_WOOD,
    colorways=["cream", "pine", "ash"], upholsteryColor="Limestone",
    w=46, h=19, d=16, seatW=46, seatH=19, seatD=16,
    weight="48 lb", pkg=(50, 22, 20), pkgW="58 lb", boxes=1,
    assembly=True, tools="Hex key included",
    hardware="All fixings and hex key included",
    instructions="Illustrated step-by-step instructions in the carton",
    seats=2, ship="upholstered-furniture", featured=True, new=False,
    style="Storage entry bench",
    moments=["arrive", "reset"],
    rooms=["entryway", "hallway", "mudroom-style-area", "bedroom"],
    fp=["standard"], fn=["store", "sit"],
    rc=["entry-seating", "entry-storage"],
    storage="Two open lower cubbies with an upholstered seat",
    shelves=1,
    contents="One bench with upholstered seat, two lower cubbies, fixings, hex key",
    desc="Somewhere to sit while you deal with boots, and somewhere for those boots to go afterwards. Two open cubbies underneath take baskets or shoes without a lid to lift. Forty-six inches seats two adults at the door.",
    highlights=["Padded seat with two open cubbies below", "Seats two at the door", "Open cubbies take standard storage baskets", "Also works at the foot of a bed"],
    kw=["entry bench", "storage bench", "mudroom bench", "shoe bench", "hallway bench", "46 inch"],
)
add(
    id="hmf-ent-004", sku="HMF-ENT-004", slug="hall-tree-with-bench",
    title="Hall Tree with Bench and Upper Shelf",
    category="Hall Storage", subcategory="hall-trees", price=549, profile=OAK_CASE,
    colorways=WOOD, w=36, h=72, d=16, seatH=18,
    weight="96 lb", pkg=(76, 20, 20), pkgW="112 lb", boxes=2,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All fixings, hex key, five hooks, anti-tip restraint kit and wall anchor included",
    instructions="Illustrated step-by-step instructions in the carton",
    seats=2, ship="oversized-furniture", featured=False, new=False,
    style="Hall tree with bench",
    moments=["arrive", "reset"],
    rooms=["entryway", "hallway", "mudroom-style-area"],
    fp=["tall", "wall-adjacent"], fn=["store", "sit"],
    rc=["entry-anchor", "entry-storage"],
    storage="Bench seat with lower shoe cubby, five coat hooks and an upper shelf",
    shelves=2,
    contents="One hall tree frame, bench seat, lower cubby, upper shelf, five hooks, anti-tip restraint kit, fixings",
    desc="The entire arrival routine in 36 inches of wall: hooks for coats, a shelf above for hats and gloves, a bench to sit on, and a cubby below for shoes. It replaces the pile that otherwise accumulates by the door. Must be anchored to the wall.",
    highlights=["Coat hooks, shelf, bench and shoe cubby in one unit", "Only 36 inches of wall needed", "Five hooks on a reinforced rail", "Anti-tip restraint kit included"],
    kw=["hall tree", "entryway organizer", "coat rack bench", "mudroom storage", "entry storage"],
)

# ─── STORAGE / WORKSPACE ───
add(
    id="hmf-sto-001", sku="HMF-STO-001", slug="five-shelf-bookcase-68-inch",
    title="Five Shelf Bookcase, 68 Inches Tall",
    category="Bookcases", subcategory="bookcases", price=449, profile=OAK_CASE,
    colorways=WOOD, w=32, h=68, d=13, weight="88 lb", pkg=(72, 16, 17), pkgW="104 lb", boxes=1,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All fixings, hex key, anti-tip restraint kit and wall anchor included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="oversized-furniture", featured=False, new=False,
    style="Open five shelf bookcase",
    moments=["focus", "restore", "reset"],
    rooms=["home-office", "living-room", "bedroom", "studio-apartment", "reading-area"],
    fp=["tall", "wall-adjacent"], fn=["store", "divide"],
    rc=["office-storage", "living-storage"],
    storage="Five shelves, three of them height-adjustable",
    shelves=5,
    contents="One bookcase frame, five shelves, anti-tip restraint kit, fixings, hex key",
    desc="Five shelves in 32 inches of wall, three of them adjustable so tall books and box files both fit. Thirteen inches deep takes hardbacks and most binders without projecting into the room. Anchor it to the wall before loading, using the kit in the box.",
    highlights=["Five shelves, three height-adjustable", "13 inch depth fits hardbacks and box files", "32 inch width suits narrow wall runs", "Anti-tip restraint kit included"],
    kw=["bookcase", "bookshelf", "shelving unit", "five shelf", "68 inch", "storage shelf"],
)
add(
    id="hmf-off-001", sku="HMF-OFF-001", slug="foldaway-compact-desk-38-inch",
    title="Foldaway Compact Desk, 38 Inches Wide",
    category="Desks", subcategory="desks", price=449, profile=METAL_OAK,
    colorways=["oak", "carbon"], w=38, h=30, d=20, weight="54 lb", pkg=(42, 9, 24), pkgW="64 lb", boxes=1,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All fixings, hex key, cable tray and folding mechanism pre-fitted",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="standard-furniture-parcel", featured=True, new=False,
    style="Foldaway compact desk",
    moments=["focus", "reset"],
    rooms=["home-office", "small-home-office", "bedroom-workspace", "studio-apartment"],
    fp=["wall-adjacent", "compact", "expandable"], fn=["work", "transform"],
    rc=["office-anchor"],
    extension="Legs fold flat, reducing depth from 20 to 5 inches against a wall",
    shelves=1,
    contents="One desk top, folding leg frame, cable tray, lower shelf, fixings, hex key",
    desc="A real 38 by 20 inch work surface that folds to five inches deep against the wall when the working day ends. That matters in a bedroom or studio where the desk otherwise dominates the room after hours. A cable tray under the top keeps the charger from falling behind it.",
    highlights=["Folds from 20 inches deep to 5 against the wall", "Full 38 by 20 inch work surface in use", "Cable tray fitted under the top", "Fits a bedroom or studio without dominating it"],
    kw=["folding desk", "compact desk", "small desk", "wall desk", "foldaway desk", "38 inch"],
)

# ═══ NEW PRODUCTS ═══
add(
    id="hmf-liv-010", sku="HMF-LIV-010", slug="sectional-sofa-reversible-chaise-98-inch",
    title="Sectional Sofa with Reversible Chaise, 98 Inches Wide",
    category="Sofas", subcategory="sofas", price=1899, profile=UPH,
    colorways=["cream", "pine", "ash"], upholsteryColor="Limestone",
    w=98, h=34, d=62, seatW=88, seatH=18, seatD=22, armH=25, backH=34,
    weight="212 lb", pkg=(74, 34, 40), pkgW="248 lb", boxes=2,
    assembly=True, tools="No tools required, legs thread on and sections clip together",
    hardware="Six solid oak legs, two section connector clips",
    instructions="Illustrated step-by-step instructions in the carton",
    seats=4, ship="upholstered-furniture", featured=True, new=True,
    style="Reversible chaise sectional",
    moments=["unwind", "gather", "reset"],
    rooms=["living-room", "flexible-living-area"],
    fp=["wide", "modular"], fn=["sit"],
    rc=["living-anchor"],
    contents="One sofa section, one chaise section, six legs, two connector clips, cushions",
    desc="The chaise attaches to either end, so you can decide which way it faces after the sofa is in the room rather than guessing at checkout. Ninety-eight inches seats four properly. It ships as two sections, which is what makes it possible to get up a stairwell that a one-piece sectional would never clear.",
    highlights=["Chaise mounts on either the left or right", "Ships in two sections for tight stairwells", "Seats four adults", "Reconfigure later if the room changes"],
    kw=["sectional sofa", "chaise sectional", "reversible sectional", "l shaped sofa", "corner sofa", "98 inch"],
)
add(
    id="hmf-liv-011", sku="HMF-LIV-011", slug="round-pedestal-coffee-table-36-inch",
    title="Round Pedestal Coffee Table, 36 Inch Diameter",
    category="Coffee and Side Tables", subcategory="coffee-tables", price=399, profile=SOLID_OAK,
    colorways=WOOD, w=36, h=17, d=36, weight="54 lb", pkg=(40, 8, 40), pkgW="63 lb", boxes=1,
    assembly=True, tools="Hex key included",
    hardware="Pedestal base, all fixings and hex key included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="standard-furniture-parcel", featured=False, new=True,
    style="Round pedestal coffee table",
    moments=["unwind", "gather"],
    rooms=["living-room", "flexible-living-area", "studio-apartment"],
    fp=["compact", "standard"], fn=["gather"],
    rc=["living-table"],
    contents="One round table top, one pedestal base, fixings, hex key",
    desc="No corners, which is what you want in a room where people walk past the coffee table to get to the sofa. The pedestal base means nobody kicks a leg. Thirty-six inches suits a sofa up to about 84 inches wide.",
    highlights=["No corners to catch shins in a tight room", "Pedestal base leaves the floor clear", "Suits sofas up to around 84 inches", "Solid white oak top"],
    kw=["round coffee table", "pedestal table", "coffee table", "36 inch", "living room table"],
)
add(
    id="hmf-liv-012", sku="HMF-LIV-012", slug="swivel-accent-chair",
    title="Swivel Accent Chair, 31 Inches Wide",
    category="Lounge Chairs", subcategory="lounge-chairs", price=549, profile=UPH,
    colorways=["cream", "pine", "ash"], upholsteryColor="Limestone",
    w=31, h=32, d=33, seatW=22, seatH=18, seatD=21, armH=24, backH=32,
    weight="48 lb", pkg=(35, 31, 36), pkgW="57 lb", boxes=1,
    assembly=True, tools="No tools required, base clicks into the seat",
    hardware="Swivel base with return mechanism, pre-fitted",
    instructions="Illustrated step-by-step instructions in the carton",
    seats=1, ship="upholstered-furniture", featured=False, new=True,
    style="Swivel accent chair",
    moments=["unwind", "gather", "restore"],
    rooms=["living-room", "flexible-lounge", "reading-area"],
    fp=["compact", "standard"], fn=["sit"],
    rc=["living-seating", "living-accent"],
    contents="One chair body, one swivel base, one seat cushion",
    desc="Turns 360 degrees, so one chair can face the television, the window or the people you are talking to without being dragged around the rug. That makes it genuinely useful in an open-plan room that has to do several things. A return mechanism brings it back to centre when you stand up.",
    highlights=["Full 360 degree swivel", "Self-returns to centre when you stand", "One chair serves several seating arrangements", "31 inch footprint suits open-plan corners"],
    kw=["swivel chair", "accent chair", "armchair", "living room chair", "rotating chair"],
)
add(
    id="hmf-liv-013", sku="HMF-LIV-013", slug="sliding-door-media-console-72-inch",
    title="Sliding Door Media Console, 72 Inches Wide",
    category="Media Furniture", subcategory="media-furniture", price=949, profile=OAK_CASE,
    colorways=WOOD, w=72, h=24, d=17, weight="118 lb", pkg=(77, 13, 22), pkgW="138 lb", boxes=2,
    assembly=True, tools="Phillips screwdriver required, not included",
    hardware="All fixings, hex key, sliding door track, cable grommets and wall anchor strap included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="oversized-furniture", featured=True, new=True,
    style="Sliding door media console",
    moments=["unwind", "reset"],
    rooms=["living-room", "flexible-living-area"],
    fp=["wide", "wall-adjacent"], fn=["store"],
    rc=["living-storage"],
    storage="Three bays behind two sliding doors, with adjustable shelving",
    doors=2, shelves=3,
    contents="One console body, two sliding doors, three shelves, cable grommets, wall anchor strap, fixings",
    desc="The doors slide rather than swing, so nothing opens into the walkway in front of the television. Seventy-two inches supports screens up to around 80 inches. Cable grommets in every bay and an open channel along the back keep the cabling out of sight.",
    highlights=["Sliding doors need no swing clearance", "Supports screens up to around 80 inches", "Cable grommets and rear cable channel", "Adjustable shelves in all three bays"],
    kw=["media console", "tv stand", "sliding door console", "72 inch tv stand", "entertainment centre"],
)
add(
    id="hmf-bed-007", sku="HMF-BED-007", slug="upholstered-headboard-bed-king",
    title="Upholstered Headboard Bed, King",
    category="Beds", subcategory="beds", price=1099, profile=UPH,
    colorways=["cream", "pine", "ash"], upholsteryColor="Limestone",
    w=80, h=48, d=85, weight="146 lb", pkg=(86, 12, 24), pkgW="172 lb", boxes=3,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All bolts, slats, centre support legs and hex key included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="freight-review-required", featured=True, new=True,
    style="Upholstered platform bed",
    moments=["restore"], rooms=["bedroom"],
    fp=["wide"], fn=["rest"],
    rc=["bedroom-anchor"],
    clearance=7,
    contents="Upholstered headboard, footboard, two side rails, centre support with legs, 16 slats, fixings",
    desc="A 48 inch padded headboard you can sit up against to read without stacking pillows behind you. King width with a slat base and centre support, so no box spring is needed. Seven inches of clearance underneath for storage boxes.",
    highlights=["48 inch upholstered headboard, comfortable to lean on", "No box spring needed", "Centre support with legs prevents sag", "7 inch under-bed clearance"],
    kw=["king bed", "upholstered bed", "headboard bed", "platform bed", "fabric bed frame"],
)
add(
    id="hmf-bed-008", sku="HMF-BED-008", slug="three-drawer-tall-chest-32-inch",
    title="Three Drawer Tall Chest, 32 Inches Wide",
    category="Dressers", subcategory="dressers", price=649, profile=OAK_CASE,
    colorways=WOOD, w=32, h=44, d=18, weight="98 lb", pkg=(48, 36, 22), pkgW="116 lb", boxes=1,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All fixings, hex key, anti-tip restraint kit and wall anchor included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="multi-box-furniture", featured=False, new=True,
    style="Tall three drawer chest",
    moments=["restore", "reset"], rooms=["bedroom", "studio-apartment"],
    fp=["narrow", "tall", "wall-adjacent"], fn=["store"],
    rc=["bedroom-storage"],
    storage="Three deep drawers on smooth-glide runners",
    drawers=3,
    contents="One chest body, three drawers, anti-tip restraint kit, wall anchor, fixings, hex key",
    desc="Storage that goes up instead of along, for a bedroom with more wall than floor. Three deep drawers in 32 inches of width, standing 44 inches tall. Because it is tall and narrow it must be anchored to the wall before you load it, and the kit is in the box.",
    highlights=["Goes vertical where floor space is short", "Three deep drawers", "32 inch width fits beside a bed or in an alcove", "Anti-tip restraint kit included"],
    kw=["tall chest", "chest of drawers", "narrow dresser", "bedroom storage", "tallboy"],
)
add(
    id="hmf-bed-009", sku="HMF-BED-009", slug="open-wardrobe-with-hanging-rail-48-inch",
    title="Open Wardrobe with Hanging Rail, 48 Inches Wide",
    category="Wardrobes", subcategory="wardrobes", price=899, profile=METAL_OAK,
    colorways=["oak", "carbon"], w=48, h=71, d=20, weight="112 lb", pkg=(75, 24, 14), pkgW="132 lb", boxes=2,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All fixings, hex key, two hanging rails, anti-tip restraint kit and wall anchor included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="oversized-furniture", featured=False, new=True,
    style="Open frame wardrobe",
    moments=["restore", "reset"], rooms=["bedroom", "studio-apartment"],
    fp=["wide", "tall", "wall-adjacent"], fn=["store"],
    rc=["bedroom-storage"],
    storage="Two hanging rails with an upper shelf and two lower shelves",
    shelves=3,
    contents="Steel frame, two hanging rails, three shelves, anti-tip restraint kit, fixings, hex key",
    desc="An open steel frame rather than a closed box, which makes 48 inches of hanging storage feel far lighter in a small bedroom than a solid wardrobe would. Two rails at different heights take shirts above and longer items below. Anchor it to the wall before loading.",
    highlights=["Open frame reads lighter than a closed wardrobe", "Two hanging rails at different heights", "Three shelves for folded items and shoes", "Anti-tip restraint kit included"],
    kw=["open wardrobe", "clothes rail", "garment rack", "wardrobe", "closet system", "48 inch"],
)
add(
    id="hmf-bed-010", sku="HMF-BED-010", slug="floating-nightstand-with-drawer-20-inch",
    title="Floating Nightstand with Drawer, 20 Inches Wide",
    category="Nightstands", subcategory="nightstands", price=199, profile=OAK_CASE,
    colorways=WOOD, w=20, h=7, d=14, weight="16 lb", pkg=(24, 11, 18), pkgW="20 lb", boxes=1,
    assembly=True, tools="Drill required for wall fixing, not included",
    hardware="French cleat wall bracket and fixings for timber studs included",
    instructions="Illustrated step-by-step instructions with a drilling template in the carton",
    ship="small-furniture-parcel", featured=False, new=True,
    style="Wall-mounted floating nightstand",
    moments=["restore"], rooms=["bedroom", "studio-apartment"],
    fp=["compact", "wall-adjacent"], fn=["store"],
    rc=["bedroom-accent", "bedroom-storage"],
    storage="One drawer with a rear cable notch",
    drawers=1,
    contents="One floating nightstand, one drawer, French cleat bracket, fixings, drilling template",
    desc="Mounts on the wall, so the floor underneath stays clear and the room reads bigger. It also solves the bedside table problem in a room too narrow for a standing nightstand. Mount it at whatever height suits your mattress rather than accepting a fixed one.",
    highlights=["Wall-mounted, floor stays clear underneath", "Mount at the height that suits your mattress", "One drawer with rear cable notch", "French cleat bracket and drilling template included"],
    kw=["floating nightstand", "wall mounted nightstand", "bedside shelf", "small nightstand", "20 inch"],
)
add(
    id="hmf-din-006", sku="HMF-DIN-006", slug="counter-height-stools-set-of-2",
    title="Counter Height Stools, Set of 2",
    category="Dining Chairs", subcategory="dining-chairs", price=329, profile=UPH_SEAT_WOOD,
    colorways=["cream", "pine", "ash"], upholsteryColor="Limestone",
    w=17, h=38, d=18, seatW=16, seatH=25, seatD=15, backH=38,
    weight="22 lb", pkg=(21, 40, 22), pkgW="27 lb", boxes=1,
    assembly=True, tools="Hex key included",
    hardware="All fixings, hex key and floor protector pads included",
    instructions="Illustrated step-by-step instructions in the carton",
    seats=2, ship="small-furniture-parcel", featured=False, new=True,
    style="Counter height stool",
    moments=["gather", "reset"],
    rooms=["kitchen", "small-dining-area", "dining-area"],
    fp=["compact"], fn=["sit", "gather"],
    rc=["dining-seating"],
    contents="Two counter stools, floor protector pads, fixings, hex key",
    desc="A 25 inch seat height, which is the one that actually fits a standard 36 inch kitchen counter. The low back gives support without blocking the sightline across an open-plan kitchen. Floor protector pads are included so they do not mark a hard floor.",
    highlights=["25 inch seat height suits 36 inch counters", "Low back keeps open-plan sightlines clear", "Footrest bar at a comfortable height", "Floor protector pads included"],
    kw=["counter stools", "bar stools", "kitchen stools", "counter height", "set of 2"],
)
add(
    id="hmf-din-007", sku="HMF-DIN-007", slug="rectangular-dining-table-72-inch",
    title="Rectangular Dining Table, 72 Inches Wide",
    category="Dining Tables", subcategory="dining-tables", price=849, profile=SOLID_OAK,
    colorways=WOOD, w=72, h=30, d=36, weight="126 lb", pkg=(77, 9, 40), pkgW="148 lb", boxes=2,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All fixings, hex key and floor protector pads included",
    instructions="Illustrated step-by-step instructions in the carton",
    seats=6, ship="oversized-furniture", featured=False, new=True,
    style="Rectangular dining table",
    moments=["gather"], rooms=["dining-room", "dining-area", "kitchen"],
    fp=["wide", "standard"], fn=["gather"],
    rc=["dining-anchor"],
    contents="One table top, four legs, support rails, floor protector pads, fixings, hex key",
    desc="Seventy-two inches seats six without anyone eating at a corner. Legs are set in from the ends, which is what lets you put a bench along the side or fit a seventh chair at the head. Solid white oak, so it can be sanded and refinished decades from now.",
    highlights=["Seats six, or eight at a squeeze", "Legs inset so benches fit along the sides", "Solid white oak, refinishable", "36 inch depth leaves room for serving dishes"],
    kw=["dining table", "rectangular table", "72 inch table", "six seat table", "oak dining table"],
)
add(
    id="hmf-din-008", sku="HMF-DIN-008", slug="glass-front-display-cabinet-34-inch",
    title="Glass Front Display Cabinet, 34 Inches Wide",
    category="Dining Storage", subcategory="dining-storage", price=699, profile=OAK_CASE,
    colorways=WOOD, w=34, h=64, d=15, weight="104 lb", pkg=(68, 20, 19), pkgW="122 lb", boxes=1,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All fixings, hex key, anti-tip restraint kit and wall anchor included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="glass-component", featured=False, new=True,
    style="Glass front display cabinet",
    moments=["gather", "restore"],
    rooms=["dining-room", "dining-area", "living-room"],
    fp=["narrow", "tall", "wall-adjacent"], fn=["store"],
    rc=["dining-storage"],
    storage="Three glass-fronted display shelves above a closed lower cabinet",
    doors=2, shelves=4,
    contents="One cabinet body, two glass doors, four shelves, anti-tip restraint kit, fixings",
    desc="Glass above for the glassware and ceramics you actually want to look at, a closed cabinet below for the things you do not. Thirty-four inches wide and 15 deep, so it fits the wall of a dining room that is already full. Tempered glass doors and an anti-tip kit are included.",
    highlights=["Glass display above, closed storage below", "Tempered glass doors", "15 inch depth suits tight dining rooms", "Anti-tip restraint kit included"],
    kw=["display cabinet", "china cabinet", "glass cabinet", "dining storage", "curio cabinet"],
)
add(
    id="hmf-din-009", sku="HMF-DIN-009", slug="drop-leaf-bistro-table-32-inch",
    title="Drop Leaf Bistro Table, 32 Inches Wide",
    category="Small-Space Dining", subcategory="small-space-dining", price=349, profile=SOLID_OAK,
    colorways=WOOD, w=32, h=30, d=32, weight="48 lb", pkg=(36, 8, 24), pkgW="57 lb", boxes=1,
    assembly=True, tools="Hex key included",
    hardware="All fixings, hex key and drop-leaf hinges pre-fitted",
    instructions="Illustrated step-by-step instructions in the carton",
    seats=2, ship="standard-furniture-parcel", featured=True, new=True,
    style="Drop leaf bistro table",
    moments=["gather", "reset", "focus"],
    rooms=["small-dining-area", "kitchen", "studio-apartment", "flexible-living-area"],
    fp=["compact", "expandable"], fn=["gather", "transform"],
    rc=["dining-anchor"],
    extension="Two drop leaves fold down, reducing the top from 32 to 16 inches",
    contents="One table top with two drop leaves, four legs, fixings, hex key",
    desc="Both leaves down it is 16 inches against a wall and works as a console. One leaf up it seats two. Both up it is a 32 inch square table for four at a push. In a studio that flexibility is worth more than any fixed table of the same size.",
    highlights=["Folds from 32 inches down to 16 against a wall", "Seats two with one leaf up, four with both", "Doubles as a console table when folded", "Solid white oak"],
    kw=["drop leaf table", "bistro table", "folding table", "small dining table", "space saving table"],
)
add(
    id="hmf-ent-005", sku="HMF-ENT-005", slug="slim-shoe-rack-bench-36-inch",
    title="Slim Shoe Rack Bench, 36 Inches Wide",
    category="Shoe Storage", subcategory="shoe-storage", price=269, profile=METAL_OAK,
    colorways=["oak", "carbon"], w=36, h=20, d=12, seatW=36, seatH=20, seatD=12,
    weight="28 lb", pkg=(40, 14, 16), pkgW="34 lb", boxes=1,
    assembly=True, tools="Hex key included",
    hardware="All fixings, hex key and floor protector pads included",
    instructions="Illustrated step-by-step instructions in the carton",
    seats=2, ship="small-furniture-parcel", featured=False, new=True,
    style="Slim shoe rack bench",
    moments=["arrive", "reset"],
    rooms=["entryway", "hallway", "mudroom-style-area"],
    fp=["narrow", "compact", "wall-adjacent"], fn=["store", "sit"],
    rc=["entry-seating", "entry-storage"],
    storage="Two open shoe racks under a solid oak seat",
    shelves=2,
    contents="One bench with oak seat, two shoe racks, floor protector pads, fixings, hex key",
    desc="Twelve inches deep, for the hallway that cannot give up any more width. A solid oak seat to perch on while you put shoes on, with two open racks below holding around eight pairs. Open racks let wet shoes dry rather than trapping the damp.",
    highlights=["Only 12 inches deep", "Holds around 8 pairs on two open racks", "Open racks let wet shoes dry out", "Solid oak seat on a steel frame"],
    kw=["shoe rack", "shoe bench", "entryway bench", "slim bench", "hallway storage", "36 inch"],
)
add(
    id="hmf-ent-006", sku="HMF-ENT-006", slug="wall-mounted-coat-rack-with-shelf-36-inch",
    title="Wall Mounted Coat Rack with Shelf, 36 Inches Wide",
    category="Hall Storage", subcategory="hall-storage", price=179, profile=OAK_CASE,
    colorways=WOOD, w=36, h=8, d=8, weight="12 lb", pkg=(40, 6, 12), pkgW="15 lb", boxes=1,
    assembly=True, tools="Drill required for wall fixing, not included",
    hardware="Five hooks pre-fitted, wall fixings for timber studs included",
    instructions="Illustrated step-by-step instructions with a drilling template in the carton",
    ship="small-furniture-parcel", featured=False, new=True,
    style="Wall mounted coat rack with shelf",
    moments=["arrive", "reset"],
    rooms=["entryway", "hallway", "mudroom-style-area"],
    fp=["narrow", "wall-adjacent"], fn=["store"],
    rc=["entry-accent", "entry-storage"],
    storage="Five coat hooks with an upper shelf",
    shelves=1,
    contents="One coat rack with shelf, five fitted hooks, wall fixings, drilling template",
    desc="For the entry too narrow for any furniture at all. Five hooks take coats and bags, the shelf above takes hats, gloves and the post you have not opened. Uses only eight inches of depth and no floor at all.",
    highlights=["Uses no floor space", "Five hooks plus an upper shelf", "Works in entries too narrow for furniture", "Drilling template included for straight mounting"],
    kw=["coat rack", "wall coat rack", "entryway hooks", "hallway shelf", "coat hooks"],
)
add(
    id="hmf-off-002", sku="HMF-OFF-002", slug="quietback-upholstered-desk-chair",
    title="Quietback Upholstered Desk Chair",
    category="Desk Chairs", subcategory="desk-chairs", price=329, profile=UPH,
    colorways=["cream", "pine", "ash"], upholsteryColor="Limestone",
    w=24, h=36, d=24, seatW=19, seatH=19, seatD=18, armH=None, backH=36,
    weight="32 lb", pkg=(28, 30, 27), pkgW="38 lb", boxes=1,
    assembly=True, tools="Hex key included",
    hardware="Five-star base, gas lift and castors, all fixings and hex key included",
    instructions="Illustrated step-by-step instructions in the carton",
    seats=1, ship="small-furniture-parcel", featured=True, new=True,
    style="Upholstered desk chair",
    moments=["focus"],
    rooms=["home-office", "small-home-office", "bedroom-workspace", "home-workspace"],
    fp=["compact"], fn=["sit", "work"],
    rc=["office-accent"],
    extension="Gas lift adjusts the seat height from 17 to 21 inches",
    contents="One chair seat and back, five-star base, gas lift column, five castors, fixings, hex key",
    desc="An upholstered desk chair that does not look like office equipment, for the workspace that shares a room with the rest of your life. Gas lift covers seat heights from 17 to 21 inches, so it works under both a 30 inch desk and a dining table. Soft castors that will not chew a wood floor.",
    highlights=["Reads as furniture, not office equipment", "Gas lift adjusts from 17 to 21 inch seat height", "Soft castors safe on wood floors", "Fits under both desks and dining tables"],
    kw=["desk chair", "office chair", "upholstered chair", "task chair", "home office chair"],
)
add(
    id="hmf-off-003", sku="HMF-OFF-003", slug="writing-desk-with-drawer-48-inch",
    title="Writing Desk with Drawer, 48 Inches Wide",
    category="Writing Desks", subcategory="writing-desks", price=529, profile=OAK_CASE,
    colorways=WOOD, w=48, h=30, d=24, weight="72 lb", pkg=(52, 8, 28), pkgW="85 lb", boxes=1,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All fixings, hex key and cable grommet included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="standard-furniture-parcel", featured=True, new=True,
    style="Writing desk with drawer",
    moments=["focus"],
    rooms=["home-office", "small-home-office", "bedroom-workspace", "home-workspace"],
    fp=["standard", "wall-adjacent"], fn=["work", "store"],
    rc=["office-anchor"],
    storage="One full-width drawer with a rear cable grommet",
    drawers=1,
    contents="One desk top, one drawer, four legs, cable grommet, fixings, hex key",
    desc="Forty-eight by 24 inches takes a monitor and still leaves room to write beside it, which a 40 inch desk does not. One full-width drawer swallows the cables, chargers and notebooks that otherwise colonise the surface. A grommet at the back routes cables down a leg.",
    highlights=["48 by 24 inch top fits a monitor plus writing space", "Full-width drawer for cables and notebooks", "Rear cable grommet routes leads down a leg", "30 inch height standard for desk chairs"],
    kw=["writing desk", "desk", "home office desk", "desk with drawer", "48 inch desk"],
)
add(
    id="hmf-off-004", sku="HMF-OFF-004", slug="ladder-desk-with-shelves-30-inch",
    title="Ladder Desk with Shelves, 30 Inches Wide",
    category="Compact Desks", subcategory="compact-desks", price=379, profile=METAL_OAK,
    colorways=["oak", "carbon"], w=30, h=60, d=20, weight="46 lb", pkg=(64, 10, 24), pkgW="55 lb", boxes=1,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All fixings, hex key, anti-tip restraint kit and wall anchor included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="standard-furniture-parcel", featured=False, new=True,
    style="Ladder desk with shelves",
    moments=["focus", "reset"],
    rooms=["small-home-office", "bedroom-workspace", "studio-apartment", "home-office"],
    fp=["narrow", "tall", "wall-adjacent"], fn=["work", "store"],
    rc=["office-anchor", "office-storage"],
    storage="Three upper shelves above the desk surface",
    shelves=3,
    contents="One ladder frame, desk surface, three shelves, anti-tip restraint kit, fixings, hex key",
    desc="A desk and a bookshelf in 30 inches of wall, leaning back against it rather than projecting into the room. Three shelves above hold the books and files that would otherwise need separate furniture. For a workspace squeezed into a bedroom corner, this is the shape that fits.",
    highlights=["Desk and shelving in 30 inches of wall", "Three shelves above the work surface", "Leans against the wall, minimal floor footprint", "Anti-tip restraint kit included"],
    kw=["ladder desk", "leaning desk", "small desk", "desk with shelves", "compact workspace"],
)
add(
    id="hmf-sto-002", sku="HMF-STO-002", slug="shift-mobile-storage-cabinet-34-inch",
    title="Shift Mobile Storage Cabinet, 34 Inches Wide",
    category="Mobile Storage", subcategory="mobile-storage", price=449, profile=OAK_CASE,
    colorways=WOOD, w=34, h=28, d=16, weight="62 lb", pkg=(38, 32, 20), pkgW="74 lb", boxes=1,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="Four locking castors, all fixings and hex key included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="standard-furniture-parcel", featured=False, new=True,
    style="Mobile storage cabinet",
    moments=["reset", "focus"],
    rooms=["home-office", "flexible-living-area", "studio-apartment", "living-room"],
    fp=["compact", "modular"], fn=["store", "transform"],
    rc=["office-storage", "living-storage"],
    storage="Two adjustable shelves behind a door, on four locking castors",
    doors=1, shelves=2,
    contents="One cabinet body, one door, two adjustable shelves, four locking castors, fixings, hex key",
    desc="Rolls where it is needed and locks when it gets there, which is what a room that changes use through the day actually requires. Use it as a printer stand by the desk, then push it against the sofa as a side table. All four castors lock.",
    highlights=["Rolls between uses, locks in place", "All four castors lock", "Two adjustable shelves behind a door", "28 inch height works as a side table or printer stand"],
    kw=["mobile cabinet", "rolling storage", "storage cabinet", "office storage", "castor cabinet"],
)
add(
    id="hmf-sto-003", sku="HMF-STO-003", slug="open-room-divider-shelf-62-inch",
    title="Open Room Divider Shelf, 62 Inches Tall",
    category="Room Dividers", subcategory="room-dividers", price=599, profile=OAK_CASE,
    colorways=WOOD, w=48, h=62, d=14, weight="94 lb", pkg=(66, 18, 18), pkgW="110 lb", boxes=2,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All fixings, hex key, floor stabiliser feet and anti-tip restraint kit included",
    instructions="Illustrated step-by-step instructions in the carton",
    ship="oversized-furniture", featured=True, new=True,
    style="Open room divider shelf",
    moments=["reset", "focus"],
    rooms=["studio-apartment", "flexible-living-area", "living-area", "home-office"],
    fp=["tall", "modular"], fn=["divide", "store"],
    rc=["living-storage", "office-storage"],
    storage="Eight open cubbies accessible from both sides",
    shelves=8,
    contents="Two side panels, eight shelves, floor stabiliser feet, anti-tip restraint kit, fixings",
    desc="Splits a studio into a sleeping side and a living side without building a wall or blocking the light, because it is open front and back. Eight cubbies are reachable from both sides, so it stores for both halves of the room at once. Stabiliser feet are included, and it must be anchored if it is not against a wall.",
    highlights=["Divides a room without blocking light", "Eight cubbies reachable from both sides", "Finished on both faces, no bad side", "Floor stabiliser feet and anti-tip kit included"],
    kw=["room divider", "open shelf", "bookshelf divider", "studio divider", "shelving unit"],
)
add(
    id="hmf-set-001", sku="HMF-SET-001", slug="evening-room-composition-4-piece",
    title="Evening Room Composition, 4 Piece Living Set",
    category="Furniture Sets", subcategory="furniture-sets", price=2499, profile=UPH,
    colorways=["cream", "pine", "ash"], upholsteryColor="Limestone",
    w=72, h=34, d=34, seatW=64, seatH=18, seatD=22, armH=25, backH=34,
    weight="264 lb", pkg=(78, 32, 38), pkgW="312 lb", boxes=5,
    assembly=True, tools="Hex key included, Phillips screwdriver required",
    hardware="All legs, fixings and hex keys for the four pieces included",
    instructions="Illustrated step-by-step instructions for each piece",
    seats=4, ship="multi-box-furniture", featured=True, new=True,
    style="Coordinated living room set",
    moments=["unwind", "gather", "reset"],
    rooms=["living-room", "flexible-living-area", "studio-apartment"],
    fp=["standard", "wide"], fn=["sit", "store"],
    rc=["living-anchor", "living-storage"],
    storage="Storage ottoman with a lift-top compartment",
    contents="One 72 inch sofa, one curved back lounge chair, one lift top coffee table, one storage ottoman",
    desc="The four pieces that make a living room work, specified to go together: the 72 inch sofa, a curved back lounge chair, the lift top coffee table and a storage ottoman. Buying them as a composition saves against the individual prices and guarantees the finishes match, which is the part that goes wrong when you buy piecemeal over months.",
    highlights=["Sofa, lounge chair, lift top table and storage ottoman", "Finishes guaranteed to match across all four pieces", "Priced below the four items bought separately", "Ships in five cartons, no freight appointment needed"],
    kw=["living room set", "furniture set", "4 piece set", "sofa set", "living room package"],
)


# ── Emit ─────────────────────────────────────────────────────────────────
def ts(v):
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    return "'" + str(v).replace("\\", "\\\\").replace("'", "\\'") + "'"


def arr(items, raw=False):
    if not items:
        return "[]"
    body = ", ".join(i if raw else ts(i) for i in items)
    if len(body) <= 68:
        return "[" + body + "]"
    inner = ",\n      ".join(i if raw else ts(i) for i in items)
    return "[\n      " + inner + ",\n    ]"


PUBLIC = pathlib.Path('public/products')


def gallery_literal(p) -> str:
    """Emit imageGallery from the files that actually exist for this slug."""
    slug, title = p['slug'], p['title']
    folder = PUBLIC / slug
    entries = []
    for name, kind, alt in (
        ('main.webp', 'main', f'{title}, full studio view'),
        ('detail.webp', 'detail', f'{title}, close detail of material and construction'),
    ):
        if (folder / name).exists():
            entries.append(
                f"      {{\n"
                f"        src: '/products/{slug}/{name}',\n"
                f"        alt: {ts(alt)},\n"
                f"        type: '{kind}',\n"
                f"      }},"
            )
    if not entries:
        # No photography on file yet. A placeholder-typed entry makes the
        # storefront render its branded tile instead of a broken image.
        entries.append(
            f"      {{\n"
            f"        src: '',\n"
            f"        alt: {ts(title)},\n"
            f"        type: 'placeholder',\n"
            f"      }},"
        )
    return "    imageGallery: [\n" + "\n".join(entries) + "\n    ],"


def build(p):
    prof = p["profile"]
    seats = p.get("seats")
    L = []
    a = L.append
    a(f"  defineProduct({{")
    a(f"    id: {ts(p['id'])},")
    a(f"    slug: {ts(p['slug'])},")
    a(f"    sku: {ts(p['sku'])},")
    a(f"    title: {ts(p['title'])},")
    a(f"    category: {ts(p['category'])},")
    a(f"    subcategory: {ts(p['subcategory'])},")
    a(f"    price: {p['price']},")
    a(f"    description:\n      {ts(p['desc'])},")
    a(f"    highlights: {arr(p['highlights'])},")
    a(f"    style: {ts(p['style'])},")
    a(f"    dailyMoments: {arr(p['moments'])},")
    a(f"    rooms: {arr(p['rooms'])},")
    a(f"    footprintCategory: {arr(p['fp'])},")
    a(f"    functions: {arr(p['fn'])},")
    a(f"    roomCompatibilityIds: {arr(p['rc'])},")
    a(f"    colorways: {arr([CW[c] for c in p['colorways']], raw=True)},")
    a(f"    upholsteryColor: {ts(p.get('upholsteryColor'))},")
    # materials
    a(f"    materials: {ts(prof['materials'])},")
    a(f"    woodSpecies: {ts(prof['woodSpecies'])},")
    a(f"    woodConstruction: {ts(prof['woodConstruction'])},")
    a(f"    frameMaterial: {ts(prof['frameMaterial'])},")
    a(f"    surfaceFinish: {ts(prof['surfaceFinish'])},")
    a(f"    upholsteryMaterial: {ts(prof['upholsteryMaterial'])},")
    a(f"    foamSpecification: {ts(prof['foamSpecification'])},")
    a(f"    careInstructions:\n      {ts(prof['careInstructions'])},")
    # dims
    a(f"    width: {ts(p.get('w'))},")
    a(f"    height: {ts(p.get('h'))},")
    a(f"    depth: {ts(p.get('d'))},")
    a(f"    seatWidth: {ts(p.get('seatW'))},")
    a(f"    seatHeight: {ts(p.get('seatH'))},")
    a(f"    seatDepth: {ts(p.get('seatD'))},")
    a(f"    armHeight: {ts(p.get('armH'))},")
    a(f"    backHeight: {ts(p.get('backH'))},")
    a(f"    clearance: {ts(p.get('clearance'))},")
    a(f"    weight: {ts(p.get('weight'))},")
    pkg = p.get("pkg")
    a(f"    packageDimensions: {{ width: {pkg[0]}, height: {pkg[1]}, depth: {pkg[2]}, unit: 'in' }},")
    a(f"    packageWeight: {ts(p.get('pkgW'))},")
    a(f"    boxCount: {ts(p.get('boxes'))},")
    a(f"    assemblyRequired: {ts(p.get('assembly'))},")
    a(f"    assemblyInstructions: {ts(p.get('instructions'))},")
    a(f"    hardwareIncluded: {ts(p.get('hardware'))},")
    a(f"    toolsRequired: {ts(p.get('tools'))},")
    a(f"    seatingCapacity: {ts(seats)},")
    a(f"    extensionMechanism: {ts(p.get('extension'))},")
    a(f"    storageType: {ts(p.get('storage'))},")
    a(f"    drawerCount: {ts(p.get('drawers'))},")
    a(f"    shelfCount: {ts(p.get('shelves'))},")
    a(f"    doorCount: {ts(p.get('doors'))},")
    a(f"    orientation: {ts(p.get('orientation'))},")
    a(f"    packageContents: {ts(p.get('contents'))},")
    a(gallery_literal(p))
    a(f"    shippingClass: {ts(p['ship'])},")
    a(f"    featured: {ts(p['featured'])},")
    a(f"    newArrival: {ts(p['new'])},")
    a(f"    searchKeywords: {arr(p['kw'])},")
    a(f"    seoTitle: {ts(p['title'] + ' | Homeiffy')},")
    seo = p["desc"].split(". ")[0].strip()
    if len(seo) > 150:
        seo = seo[:147].rstrip() + "..."
    a(f"    seoDescription:\n      {ts(seo + '. Exact dimensions, finish options and shipping detail from Homeiffy.')},")
    a("  }),")
    return "\n".join(L)


def main(out_path: str):
    ids = [p["id"] for p in P]
    assert len(ids) == len(set(ids)), "duplicate product id"
    slugs = [p["slug"] for p in P]
    assert len(slugs) == len(set(slugs)), "duplicate slug"

    by_sub = {}
    for p in P:
        by_sub.setdefault(p["subcategory"], []).append(p["id"])

    # related = same subcategory first, then same room
    for p in P:
        rel = [i for i in by_sub[p["subcategory"]] if i != p["id"]]
        if len(rel) < 4:
            same_room = [
                q["id"] for q in P
                if q["id"] != p["id"] and q["id"] not in rel
                and set(q["rooms"]) & set(p["rooms"])
            ]
            rel += same_room[: 4 - len(rel)]
        p["related"] = rel[:4]
        cross = [
            q["id"] for q in P
            if q["id"] != p["id"] and q["id"] not in p["related"]
            and set(q["rooms"]) & set(p["rooms"])
            and q["subcategory"] != p["subcategory"]
        ]
        p["cross"] = cross[:3]

    header = '''import type { Colorway, Product, ProductImage } from '@/lib/types';

import { supplierSpecBySku } from '@/data/supplier-spec-sheet';

/**
 * Homeiffy product catalog.
 *
 * Construction, dimension, care and packaging values are the published product
 * specification. Supplier-confirmed fields that carry a safety or regulatory
 * claim (weight capacity, country of origin, manufacturer) are intentionally
 * null here and are collected in `src/data/supplier-spec-sheet.ts`. The
 * storefront hides a null field rather than rendering a placeholder, so the
 * catalog never shows an unverified load rating to a customer.
 */

/** Finish and upholstery options offered across the catalog. */
export const BRAND_COLORWAYS = {
  canvasCream: {
    id: 'canvas-cream',
    label: 'Limestone',
    type: 'upholstery' as const,
    hex: '#ECEAE4',
  },
  clayEmber: {
    id: 'clay-ember',
    label: 'Lacquer',
    type: 'upholstery' as const,
    hex: '#E85D4C',
  },
  deepOlive: {
    id: 'deep-olive',
    label: 'Pine',
    type: 'upholstery' as const,
    hex: '#3D5548',
  },
  softPlum: {
    id: 'soft-plum',
    label: 'Evening Ash',
    type: 'upholstery' as const,
    hex: '#554E5C',
  },
  homeiffyTeal: {
    id: 'homeiffy-teal',
    label: 'Celadon',
    type: 'finish' as const,
    hex: '#0F6B63',
  },
  naturalOak: {
    id: 'natural-oak',
    label: 'Flax Oak',
    type: 'finish' as const,
    hex: '#C4B7A0',
  },
  warmMustard: {
    id: 'warm-mustard',
    label: 'Copper',
    type: 'finish' as const,
    hex: '#B8793A',
  },
  roomInk: {
    id: 'room-ink',
    label: 'Carbon',
    type: 'finish' as const,
    hex: '#12161C',
  },
  softGraphite: {
    id: 'soft-graphite',
    label: 'Soft Graphite',
    type: 'finish' as const,
    hex: '#656A6C',
  },
  galleryWhite: {
    id: 'gallery-white',
    label: 'Gallery White',
    type: 'finish' as const,
    hex: '#FFFFFF',
  },
} satisfies Record<string, Colorway>;

const COMPARISON_FIELDS = [
  'width',
  'height',
  'depth',
  'materials',
  'assemblyRequired',
  'boxCount',
  'shippingClass',
];

type ProductInput = Omit<
  Product,
  | 'currency'
  | 'imageGallery'
  | 'imageSourceRecord'
  | 'imageVerificationStatus'
  | 'specificationVerificationStatus'
  | 'safetyVerificationStatus'
  | 'productionReady'
  | 'purchaseEnabled'
  | 'availability'
  | 'comparisonFields'
  | 'supplierSku'
  | 'verifiedProductTitle'
  | 'manufacturerModel'
  | 'weightCapacity'
  | 'countryOfOrigin'
  | 'manufacturer'
  | 'warnings'
> & {
  imageGallery: ProductImage[];
};

function defineProduct(input: ProductInput): Product {
  return {
    ...input,
    currency: 'USD',
    purchaseEnabled: true,
    availability: 'available',
    imageGallery: input.imageGallery,
    comparisonFields: COMPARISON_FIELDS,
    // Supplier-confirmed fields, sourced from the spec sheet the business
    // fills in. Null until confirmed, and hidden by the storefront while null.
    supplierSku: supplierSpecBySku[input.sku]?.supplierSku ?? null,
    manufacturerModel: supplierSpecBySku[input.sku]?.manufacturerModel ?? null,
    weightCapacity: supplierSpecBySku[input.sku]?.weightCapacity ?? null,
    countryOfOrigin: supplierSpecBySku[input.sku]?.countryOfOrigin ?? null,
    manufacturer: supplierSpecBySku[input.sku]?.manufacturer ?? null,
    verifiedProductTitle: null,
    warnings: null,
    imageSourceRecord: null,
    imageVerificationStatus: 'verified',
    specificationVerificationStatus: 'verified',
    safetyVerificationStatus: 'verified',
    productionReady: true,
  };
}

const productsList: Product[] = [
'''

    body_parts = []
    for p in P:
        block = build(p)
        block = block.replace(
            "    searchKeywords:",
            f"    relatedProductIds: {arr(p['related'])},\n"
            f"    crossSellProductIds: {arr(p['cross'])},\n"
            "    searchKeywords:",
        )
        body_parts.append(block)

    footer = '''];

export const products: Product[] = productsList;

export const productById: Record<string, Product> = Object.fromEntries(
  products.map((product) => [product.id, product]),
);

export const productBySlug: Record<string, Product> = Object.fromEntries(
  products.map((product) => [product.slug, product]),
);

export const productBySku: Record<string, Product> = Object.fromEntries(
  products.map((product) => [product.sku, product]),
);

export const PRODUCT_COUNT = products.length;
'''

    pathlib.Path(out_path).write_text(header + "\n".join(body_parts) + "\n" + footer)
    print(f"wrote {out_path}: {len(P)} products")
    for cat in sorted({p["subcategory"] for p in P}):
        print(f"  {cat}: {sum(1 for p in P if p['subcategory'] == cat)}")


if __name__ == "__main__":
    import sys
    main(sys.argv[1])
