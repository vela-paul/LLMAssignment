"""Tools for the Smart Librarian chatbot."""

book_summaries_dict = {
    "1984": (
        "Romanul lui George Orwell descrie o societate distopică aflată sub controlul total al statului. "
        "Oamenii sunt supravegheați constant de Big Brother, iar gândirea liberă este considerată crimă. "
        "Winston Smith încearcă să reziste acestui regim opresiv în căutarea adevărului și libertății. "
        "Este o poveste despre manipulare ideologică și pierderea identității."),
    "The Hobbit": (
        "Bilbo Baggins, un hobbit confortabil, este recrutat de un grup de pitici pentru a-și recupera comoara de la dragonul Smaug. "
        "În timpul călătoriei, descoperă curajul și ingeniozitatea pe care nu știa că le are. "
        "Întâlnește creaturi fantastice și își face prieteni loiali. "
        "O aventură despre prietenie și maturizare."),
    "The Lord of the Rings": (
        "Saga lui Frodo Baggins și a tovarășilor săi în încercarea de a distruge Inelul Suprem. "
        "Călătoria lor traversează peisaje grandioase și bătălii epice împotriva forțelor lui Sauron. "
        "Povestea explorează tema sacrificiului și a puterii corupătoare. "
        "Un roman monumental despre lupta dintre bine și rău."),
    "Harry Potter and the Sorcerer's Stone": (
        "Harry descoperă că este vrăjitor și intră în lumea magică la Hogwarts. "
        "Își face prieteni apropiați, Ron și Hermione, și se confruntă cu primele încercări ale lui Voldemort. "
        "Școala îi oferă un sentiment de apartenență pe care nu l-a avut niciodată. "
        "Poveste despre curaj, prietenie și descoperirea de sine."),
    "To Kill a Mockingbird": (
        "Prin ochii lui Scout Finch, romanul examinează prejudecățile rasiale din sudul Statelor Unite. "
        "Tatăl ei, avocatul Atticus, apără un om nevinovat acuzat pe nedrept. "
        "Copiii învață lecții despre empatie și justiție. "
        "Este o reflecție asupra moralității și compasiunii."),
    "Pride and Prejudice": (
        "Elizabeth Bennet se confruntă cu presiunile sociale ale epocii și cu propriile prejudecăți față de Mr. Darcy. "
        "Întâlnirile și neînțelegerile lor dezvăluie diferențe de clasă și caracter. "
        "Pe măsură ce se cunosc, descoperă respect și dragoste adevărată. "
        "Un roman despre evoluție personală și relații sincere."),
    "The Catcher in the Rye": (
        "Holden Caulfield povestește rătăcirile sale prin New York după exmatriculare. "
        "Este dezamăgit de falsitatea lumii adulte și tânjește după inocență. "
        "Întâlnirile cu oameni diverși îi accentuează alienarea. "
        "O explorare a anxietății adolescenței și a identității."),
    "The Chronicles of Narnia": (
        "Frații Pevensie descoperă regatul Narnia, unde leul Aslan luptă împotriva Vrăjitoarei Albe. "
        "Copiii devin regi și regine și învață lecții despre curaj și credință. "
        "Narnia este un loc al miracolelor și al aventurii. "
        "Seria reflectă teme religioase și morale."),
    "War and Peace": (
        "Romanul urmărește viețile aristocraților ruși în perioada războaielor napoleoniene. "
        "Personajele se confruntă cu dragostea, destinul și tragediile războiului. "
        "Tolstoi combină istoria cu filozofia personală. "
        "O frescă vastă a societății ruse."),
    "The Book Thief": (
        "Liesel Meminger fură cărți pentru a face față realităților dure ale Germaniei naziste. "
        "Familia ei adoptivă ascunde un evreu în pivniță, riscând totul. "
        "Narațiunea este condusă de Moarte, care observă umanitatea în vremuri întunecate. "
        "Poveste despre puterea cuvintelor și curaj."),
}


def get_summary_by_title(title: str) -> str:
    """Returnează rezumatul complet pentru titlul dat."""
    return book_summaries_dict.get(title, "Rezumat indisponibil pentru acest titlu.")
