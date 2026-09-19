import os
import re

STREETS = [
    # Crindau
    ("Agincourt Street", "agincourt-street.html", "CRIN-STR-002", "Artisan residential terrace off Albany Street."),
    ("Ailesbury Street", "ailesbury-street.html", "CRIN-STR-003", "Civic and residential corridor fronting Crindau Board School."),
    ("Argyle Street", "argyle-street.html", "CRIN-STR-004", "Residential terrace row running north off Albany Street."),
    ("Adelaide Street", "adelaide-street.html", "CRIN-STR-005", "Eastern industrial spur leading towards the River Usk wharves."),
    ("Aragon Street", "aragon-street.html", "CRIN-STR-006", "Late-Victorian residential terrace within the Crindau quarter."),
    ("Alderney Street", "alderney-street.html", "CRIN-STR-007", "Artisan terrace housing near the railway corridor."),
    ("The Turnstiles", "the-turnstiles.html", "CRIN-STR-008", "Historic pedestrian thoroughfare providing access to the works and rail beds."),
    ("Glassworks Cottages", "glassworks-cottages.html", "CRIN-STR-009", "Specialist worker dwellings adjoining the South Wales Glass Works."),

    # Malpas Road
    ("Malpas Road", "malpas-road.html", "CRIN-STR-010", "Ancient turnpike arterial running along the western flank of the district."),
    ("Goodrich Crescent", "goodrich-crescent.html", "CRIN-STR-011", "Early-twentieth-century residential crescent off Malpas Road."),
    ("Walford Street", "walford-street.html", "CRIN-STR-012", "Victorian cross-street connecting arterial corridors."),
    ("Ross Lane", "ross-lane.html", "CRIN-STR-013", "Historic rear service lane and access route."),
    ("Malpas Lane", "malpas-lane.html", "CRIN-STR-014", "Historic parish byway connecting rural lands to the highway."),
    ("Pant Road", "pant-road.html", "CRIN-STR-015", "Ascending residential street on the western slopes."),
    ("Pant Lane", "pant-lane.html", "CRIN-STR-016", "Traditional access lane off Pant Road."),
    ("Ross Street", "ross-street.html", "CRIN-STR-017", "Artisan terraced row linking western residential blocks."),
    ("Jewell Lane", "jewell-lane.html", "CRIN-STR-018", "Historic tenement access way and rear mews."),
    ("Aston Crescent", "aston-crescent.html", "CRIN-STR-019", "Curved residential streetscape of the early 20th century."),

    # Brynglas
    ("Prospect Street", "prospect-street.html", "CRIN-STR-020", "Elevated residential terrace overlooking the Crindau valley."),
    ("Chelston Place", "chelston-place.html", "CRIN-STR-021", "Quiet residential enclave developed at the turn of the century."),
    ("Spring Street", "spring-street.html", "CRIN-STR-022", "Late-Victorian artisan residential row."),
    ("Crindau Road", "crindau-road.html", "CRIN-STR-023", "Historical manorial roadway leading past Crindau House."),
    ("Redland Street", "redland-street.html", "CRIN-STR-024", "Terraced street connecting the lower marsh with higher ground."),
    ("Brynglas Street", "brynglas-street.html", "CRIN-STR-025", "Spine road of the early Brynglas residential development."),
    ("Brynglas Avenue", "brynglas-avenue.html", "CRIN-STR-026", "Residential avenue in the northern quarter."),
    ("Brynglas Road", "brynglas-road.html", "CRIN-STR-027", "Main ascending thoroughfare serving the Brynglas estate."),
    ("Bryn Bevan", "bryn-bevan.html", "CRIN-STR-028", "Post-war residential expansion on the upper slopes."),
    ("Brynglas Drive", "brynglas-drive.html", "CRIN-STR-029", "Modern residential drive across upper Brynglas."),
    ("Brynglas Court", "brynglas-court.html", "CRIN-STR-030", "Residential enclave of the mid-twentieth-century development."),

    # Shaftesbury
    ("Lyne Road", "lyne-road.html", "CRIN-STR-031", "Dense Victorian terrace corridor running parallel to the railway."),
    ("Edwin Street", "edwin-street.html", "CRIN-STR-032", "Late-nineteenth-century artisan row in Shaftesbury."),
    ("Evans Street", "evans-street.html", "CRIN-STR-033", "Residential terrace street housing railway and industrial workers."),
    ("Tetbury Close", "tetbury-close.html", "CRIN-STR-034", "Modern residential close built on reclaimed rail ground."),
    ("Salisbury Close", "salisbury-close.html", "CRIN-STR-035", "Residential cul-de-sac within the Shaftesbury redevelopment."),
    ("Ledbury Drive", "ledbury-drive.html", "CRIN-STR-036", "Twentieth-century residential drive in southern Shaftesbury."),
    ("Glastonbury Close", "glastonbury-close.html", "CRIN-STR-037", "Modern residential close off the primary thoroughfares."),
    ("Malmesbury Close", "malmesbury-close.html", "CRIN-STR-038", "Quiet residential close of late-20th-century infill."),
    ("Shrewsbury Close", "shrewsbury-close.html", "CRIN-STR-039", "Residential close located in the Shaftesbury quarter."),
    ("Tewkesbury Walk", "tewkesbury-walk.html", "CRIN-STR-040", "Dedicated pedestrian way traversing the residential blocks."),
    ("Shaftesbury Street", "shaftesbury-street.html", "CRIN-STR-041", "Principal southern boundary arterial connecting Crindau to town."),
    ("Hoskins Street", "hoskins-street.html", "CRIN-STR-042", "Victorian railwaymen and dockers' residential terrace."),
    ("Wheeler Street", "wheeler-street.html", "CRIN-STR-043", "Artisan terrace row off the Shaftesbury arterial."),
    ("Pugsley Street", "pugsley-street.html", "CRIN-STR-044", "Late-Victorian residential terrace housing industrial labourers."),
    ("Hewertson Street", "hewertson-street.html", "CRIN-STR-045", "Artisan brick terrace in the Shaftesbury railway grid."),
    ("Henry Street", "henry-street.html", "CRIN-STR-046", "Residential terrace row established during the Victorian rail boom.")
]

template_path = os.path.join("streets", "albany-street.html")

if not os.path.exists(template_path):
    print(f"Error: Could not find template at {template_path}")
    exit(1)

with open(template_path, "r", encoding="utf-8") as f:
    template_content = f.read()

count = 0
for name, filename, cad_ref, tagline in STREETS:
    out_path = os.path.join("streets", filename)
    json_name = filename.replace(".html", ".json")

    content = template_content

    # Replace Title and Headers
    content = content.replace("<title>Albany Street •", f"<title>{name} •")
    content = content.replace("CADASTRE REF: CRIN-STR-001", f"CADASTRE REF: {cad_ref}")
    content = content.replace('<h2 class="street-title">Albany Street</h2>', f'<h2 class="street-title">{name}</h2>')
    content = re.sub(r'<p class="street-tagline">.*?</p>', f'<p class="street-tagline">{tagline}</p>', content)

    # Replace JSON data path
    content = content.replace("'../data/albany-street.json'", f"'../data/{json_name}'")
    content = content.replace('"../data/albany-street.json"', f'"../data/{json_name}"')

    # Replace drawer plot heading
    content = content.replace("Albany Street</h3>", f"{name}</h3>")

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content)
    
    count += 1

print(f"Done: {count} street HTML files generated in /streets/")