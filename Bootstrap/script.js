/*
javascript file for mindmap template to generate the finger game
*/

const num_of_friends = 8;
const categories = ['Animals', 'Brands', 'Famous People', 'Countries & Cities', 'Food & Ingredients', 'Schools (All Levels)', 'Songs'];
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const gender = 'Female' // Default gender of main person is Male

//Lower refers to the lower level of the random number generator for category and letter generators
let lower = 0;
//Upper_alphabet here is for generating letter from alphabet
let upper_alphabet = 26;
//Upper_responses here is for generating the random outside responses based on an array of length 10 for each letter
let upper_responses = 10;
//Upper_categories here is for generating the category from an array of categories
let upper_categories = categories.length;

//This is a dictionary to store all the possible answers for the outside people to extract from
let dictionary = new Map();

//Assigning the required elements to variables for the game to work dynamically
let main_person = document.getElementById('main-person');
let other_people = document.getElementsByClassName('other-people');
let other_people_desc = document.querySelectorAll('section.other-people p[name="description"]');
let button_category = document.getElementById('category-generator');
let category_display = document.getElementById('category-display');
let button_letter = document.getElementById('letter-generator');
let letter_display = document.getElementById('letter-display');
let main_name = document.getElementById('main-person-name');
let main_answer = document.querySelector('div#main-person-details input[name="main-answer"]');
let level = document.querySelectorAll('form#difficulty input[name="difficulty-level"]');
let comments = document.getElementById('commentator');

//Special block of code to initialize outside responses, converting them to an array and sorting
//the members based on the answer-id of each friend bot in order to display their answers in a
//counter-clockwise manner instead of a row manner
let outside_responses = document.querySelectorAll('input[name="answer"]');
regex_pattern = new RegExp('\\d');
outside_responses =  Array.prototype.slice.call(outside_responses, 0).sort((a, b) => {return parseInt(a.id.match(regex_pattern)[0]) - parseInt(b.id.match(regex_pattern)[0])});

//Special block of code to initalize names of outside people in a counter-clockwise manner
//instead of a row manner
let names = [];
for (i = 1; i <= num_of_friends; i++) {
    names.push(document.querySelector(`section#person-${i} h5[name="name"]`));
}

//Level value denotes the difficulty level chosen, default value is 1 which represents Easy
let level_value;

//Initialzing an array of unique numbers to an array with the size of num_of_friends
//These unique numbers are numbered from 1 to 10 to denote which response each outside person will give
//based on the arrays of the letter of a certain category
let unique_numbers = [];

//Function will return values of certain comments/styles that will change based on the main person's gender
function gender_discrepancy(male_value, female_value) {
    let overall_value;
    if (gender == 'Male') {
        overall_value = male_value;
    }
    else {
        overall_value = female_value;
    }
    return overall_value
}

//Function to depict the time delay of revealing the outside responses
//To be invoked as part of the forEach method in the event listener for button_letter
function response_delay(item, index) {
    let timeoutID = setTimeout(() => {
        item.value = dictionary.get(letter_display.value)[unique_numbers[index]];
        item.type = "text";
    }, this); //this keyword refers to the amount of time delayed that will be specified later
    main_answer.addEventListener('keyup', (e) => {
        if (e.keyCode == 13) {
            clearTimeout(timeoutID);
        }
    });
}

//Function to depict the time intervals of the revelation of outside responses
//To be invoked in the event listener for button_letter
function response_interval(time_interval) {
    //Revealing the outside answers one at a time
    let count = 0;
    let intervalID = setInterval(() => {
        outside_responses[count].value = dictionary.get(letter_display.value)[unique_numbers[count]];
        outside_responses[count].type = "text";
        count ++;
        if (count == num_of_friends) {
            clearInterval(intervalID);
        }
    }, time_interval);
    main_answer.addEventListener('keyup', (e) => {
        if (e.keyCode == 13) {
            clearInterval(intervalID);
        }
    })
}

//Function used to display the comments, re-enable the level options, generator buttons, and
//toggle the main answer disability if the user fails to enter an answer before the
//last outside person
//To be invoked in the event listener for button_letter
function empty_main_response(comment, time_gap, main_disabled = true) {
  let timeoutID = setTimeout(() => {
      if (outside_responses[num_of_friends - 1].value) {
          comments.hidden = false;
          comments.innerHTML = comment;
          comments.style = "background-color: #ff5959"
          button_letter.disabled = false;
          button_category.disabled = false;
          level.forEach((option) => {
              option.disabled = false;
          })
          main_answer.disabled = main_disabled;
      }
  }, time_gap);
  main_answer.addEventListener('keyup', (e) => {
      if (e.keyCode == 13) {
          clearTimeout(timeoutID);
      }
  });
}

//Assigning website colors based on the gender of the main person
body_color = gender_discrepancy('#78fee0', '#fce2db');
main_person_color = gender_discrepancy('#fef4a9', '#c295d8');
other_people_bg_color = gender_discrepancy('#4bc2c5', '#ff8ba7');
other_people_desc_color = gender_discrepancy('#7a57d1', '#446491');
other_people_answer_bg_color = gender_discrepancy('#071a52', '#6a197d');

document.body.style = `background-color:${body_color};`;
main_person.style = `background-color:${main_person_color}; border: 5px solid ${main_person_color};`;
for (i = 0; i < num_of_friends; i++) {
    other_people[i].style = `background-color:${other_people_bg_color}; border: 5px solid ${other_people_bg_color};`;
    other_people_desc[i].style = `color:${other_people_desc_color};`;
    outside_responses[i].style = `background-color:${other_people_answer_bg_color};`;
}

//Event Listener when the Category button is clicked
button_category.addEventListener('click', () => {
    //Resetting user's answer textbox everytime the letter generator button is clicked
    main_answer.value = null;
    main_answer.style = "color: default; background-color: default;";

    //Generating the random category when the user click on the button
    let random_int = Math.floor(Math.random() * (upper_categories - lower) + lower);
    category_display.value = categories[random_int];

    //Undoing the disabling of the letter generator button once the user generates a category
    button_letter.disabled = false;

    //Choosing the correct dictionary based on the chosen random category
    switch (category_display.value) {
        case 'Animals':
            dictionary.set('A', ['Alligator', 'Anaconda', 'Anteater', 'Antelope', 'Armadillo', 'Ape', 'Anemone', 'Anglerfish', 'Axolotl', 'Albatross']);
            dictionary.set('B', ['Bear', 'Buffalo', 'Boar', 'Bull', 'Butterfly', 'Baboon', 'Badger', 'Barracuda', 'Bat', 'Beetle']);
            dictionary.set('C', ['Cow', 'Cat', 'Crow', 'Cougar', 'Catfish', 'Chameleon', 'Cheetah', 'Chicken', 'Crab', 'Coyote']);
            dictionary.set('D', ['Dog', 'Dingo', 'Dung Beetle', 'Duck', 'Dolphin', 'Dragonfly', 'Deer', 'Dove', 'Donkey', 'Dugong']);
            dictionary.set('E', ['Elephant', 'Eel', 'Eagle', 'Elk', 'Emu', 'Earwig', 'Echidna', 'Eland', 'Elephant Seal', 'Egret']);
            dictionary.set('F', ['Fox', 'Firefly', 'Fly', 'Fish', 'Flamingo', 'Falcon', 'Frog', 'Ferret', 'Flea', 'Flounder']);
            dictionary.set('G', ['Giraffe', 'Gazelle', 'Goat', 'Gorilla', 'Goldfish', 'Goose', 'Gecko', 'Guinea Pig', 'Grasshopper', 'Guppy']);
            dictionary.set('H', ['Hippopotamus', 'Hamster', 'Hound', 'Hare', 'Horse', 'Hyena', 'Humpback Whale', 'Hawk', 'Hedgehog', 'Hummingbird']);
            dictionary.set('I', ['Iguana', 'Impala', 'Ibex', 'Ibis', 'Indri', 'Isopod', 'Inchworm', 'Indian Elephant', 'Indian Peacock', 'Indian Leopard']);
            dictionary.set('J', ['Jaguar', 'Jackal', 'Jellyfish', 'Jackrabbit', 'Jabiru', 'Jerboa', 'Junglefowl', 'Jay', 'Jaguarundi', 'Jaeger']);
            dictionary.set('K', ['Kangaroo', 'Koala', 'Komodo Dragon', 'Kiwi', 'Krill', 'Kingfisher', 'Killer Whale', 'Kinkajou', 'Kookaburra', 'Kakapo']);
            dictionary.set('L', ['Lion', 'Ladybug', 'Liger', 'Lobster', 'Llama', 'Leopard', 'Leech', 'Lizard', 'Locust', 'Lemur']);
            dictionary.set('M', ['Mouse', 'Meerkat', 'Moose', 'Monkey', 'Manatee', 'Mockingbird', 'Millipede', 'Mole', 'Molusk', 'Mule']);
            dictionary.set('N', ['Nightingale', 'Nighthawk', 'Nurse Shark', 'Narwhal', 'Newt', 'Numbat', 'Nutria', 'Nuthatch', 'Nyala', 'Nutcracker']);
            dictionary.set('O', ['Owl', 'Orangutan', 'Octopus', 'Ox', 'Oyster', 'Orca', 'Ostrich', 'Otter', 'Ocelot', 'Oriole']);
            dictionary.set('P', ['Peacock', 'Panther', 'Panda', 'Puma', 'Python', 'Platypus', 'Penguin', 'Parrot', 'Pigeon', 'Porcupine']);
            dictionary.set('Q', ['Quail', 'Quetzal', 'Quokka', 'Quoll', 'Quelea', 'Queen Snake', 'Qinling Panda', 'Quahog Clam', 'Quillback Rockfish', 'Queen Triggerfish']);
            dictionary.set('R', ['Rhinoceros', 'Rat', 'Reindeer', 'Rooster', 'Ram', 'Raccoon', 'Raven', 'Rattlesnake', 'Robin', 'Roadrunner']);
            dictionary.set('S', ['Snake', 'Salamander', 'Starfish', 'Shark', 'Seal', 'Seahorse', 'Sheep', 'Scorpion', 'Spider', 'Stingray']);
            dictionary.set('T', ['Tiger', 'Turtle', 'Tortoise', 'Tuna', 'Tarantula', 'Tick', 'Tasmanian Devil', 'Turkey', 'Toad', 'Tapir']);
            dictionary.set('U', ['Urchin', 'Uakari', 'Umbrellabird', 'Unau', 'Urial', 'Uromastix', 'Uguisu', 'Urva', 'Uinta Ground Squirrel', 'Unicorn Fish']);
            dictionary.set('V', ['Vulture', 'Vampire Bat', 'Viper', 'Vervet Monkey', 'Vole', 'Vicuna', 'Viperfish', 'Violet-crested Turaco', "Verreaux's sifaka", 'Vine Snake']);
            dictionary.set('W', ['Walrus', 'Wombat', 'Worm', 'Wolf', 'Whale', 'Wildebeest', 'Wasp', 'Woodpecker', 'Wolverine', 'Weasel']);
            dictionary.set('X', ['X-Ray Fish', 'Xenops Bird', 'Xerus', 'Xenopus', 'Xenopoecilus Fish', 'Xeme Bird', 'Xanclomys', "Xantus's Hummingbird", 'Xantis', 'Xenopeltidae Sunbeam Snake']);
            dictionary.set('Y', ['Yak', 'Yabby', 'Yellow Ground Squirrel', 'Yellowhammer', 'Yellowjacket', 'Yellow Baboon', 'Yellow-billed Stork', 'Yellow Mongoose', 'Yellow-bellied Marmot', 'Yellow-headed Caracara']);
            dictionary.set('Z', ['Zebra', 'Zebrafish', 'Zebu', 'Zokor', 'Zonkey', 'Zorse', 'Zorilla', 'Zorro', 'Zebra Finch', 'Zigzag Salamander']);
            break;

        case 'Brands':
            dictionary.set('A', ['Allbirds', 'Audemars Piguet', 'Audi', 'Aetna', 'Amazon', 'Acura', 'Adidas', 'Abercrombie & Fitch', 'Alexander Wang', 'Apple']);
            dictionary.set('B', ['Bugatti', 'BreadTalk', 'Balenciaga', 'Billabong', 'Burberry', 'Bed Bath & Beyond', 'Blue Bird', 'Baileys', 'Big Baller Brand', 'Burger King']);
            dictionary.set('C', ['Charles & Keith', 'Calvin Klein', 'Coca-Cola', 'Champion', 'Corsair', 'Cole Haan', "Campbell's", 'Chanel', 'Canada Goose', 'CIROC']);
            dictionary.set('D', ['Disney', 'Doritos', 'Daihatsu', 'Dunkin Donuts', 'DKNY', "Domino's", 'Dell', 'Dyson', 'Dasani', 'Dove']);
            dictionary.set('E', ['Epic Games', 'Emporio Armani', 'Essential Home', 'Eugenia Kim', 'Equinox', 'Elliott Lauren', 'Electric', 'Easy Spirit', 'ECCO', 'El Naturalista']);
            dictionary.set('F', ['Fitbit', 'Fendi', 'French Connection', 'Fila', 'Fairway', 'Ford', 'Ferrari', 'Fashion Union', 'Fenty Beauty', 'Freshly']);
            dictionary.set('G', ['Gigabyte', 'G-Shock', 'Glossier', 'Gojek', 'Grey Goose', 'Gap', 'Gorgio Armani', 'General Electric', 'Giovanni', 'Givenchy']);
            dictionary.set('H', ['Honey Stars', 'Hermes', 'Huggies', 'HARBS', 'Haagen-Dazs', 'Hublot', 'Hilton Hotels', 'Harley-Davidson', 'Hyundai', 'Horlicks']);
            dictionary.set('I', ['IKEA', 'IWC', 'Infiniti', 'Intel', 'IBM', 'InFocus', 'Ivy Terrace', 'IHOP', 'IMAX', 'International Home Interiors']);
            dictionary.set('J', ['J.Crew', 'JP Morgan', 'Jamie Oliver', 'Jaguar', 'John Hardy', 'Jamba Juice', 'Jivago Watches', 'James Perse', "Jack Daniel's", "J'Adore Les Fleurs"]);
            dictionary.set('K', ['Kenzo', 'Koko Krunch', 'Kirkland Signature', 'KitchenAid', 'Kith', 'KFC', 'Kylie Cosmetics', "Kellogg's", 'KOIO', 'Krispy Kreme']);
            dictionary.set('L', ['Louis Vuitton', 'La Croix', 'Laduree', 'Lacoste', 'Lululemon', "Levi's", 'Lenovo', "L'Oreal", 'Lego', 'Logitech']);
            dictionary.set('M', ['MSI', 'Mercedes-Benz', 'Milo', 'Marc Jacobs', 'Magnolia Bakery', 'McDonalds', "M&M's", 'Maison Kitsune', 'Maxim', 'Moncler']);
            dictionary.set('N', ['Nike', 'New Balance', 'Nescafe', 'Nokia', 'Nvidia', 'Nintendo', 'Nissan', 'Nikon', 'NEWater', 'Nerf']);
            dictionary.set('O', ['OMEGA', 'Off-White', 'Organic Valley', 'Oreo', 'Oakley', 'Osiris', 'Opening Ceremony', 'Olympus', 'Oldsmobile', 'Oliver Peoples']);
            dictionary.set('P', ['Pedro', 'Prada', 'PopCorners', 'Pepsi', 'Panadol', 'PURPLE BRAND', 'Poland Spring', 'Puma', 'Paris Baguette', 'Patek Phillipe']);
            dictionary.set('Q', ['Qatar Airways', 'Qantas', 'Qsymia', 'Quavers', 'Quiksilver', 'Qualcomm', 'Quorum International', 'Qingdao Airlines', 'Qazaq Air', 'Queen Bee']);
            dictionary.set('R', ['Ryzen', 'Radeon', 'Rolex', 'Rag & Bone', 'Reebok', 'Razer', 'Reformation', 'Ray-Ban', 'RIPNDIP', 'Royal Carribean']);
            dictionary.set('S', ['SONY', 'SEPHORA', 'Samsung', 'Starbucks', 'Supreme', 'Steinway & Sons', 'Smirnoff', 'SLS', 'Saxenda', 'Samsonite']);
            dictionary.set('T', ['Timberland', 'TAG Heuer', 'Tiffany & Co', 'Tesla', "Trader Joe's", 'The Ritz-Carlton', 'Toyota', 'Taco Bell', 'Tom Ford', 'Tommy Hilfiger']);
            dictionary.set('U', ['Uniqlo', 'Undercover', 'Undefeated', 'Ulysse Nardin', 'United Airlines', 'Under Armour', 'Urban Decay', 'Universal', 'Urban Outfitters', 'Unravel']);
            dictionary.set('V', ['Vacheron Constantin', 'Venus ET Fleur', 'Volkswagen', 'Vans', 'Valentino', 'Van Leeuwen', 'Vogue', 'Victorinox', 'Vince', "Victoria's Secret"]);
            dictionary.set('W', ['White Claw', 'WTAPS', 'WestJet', 'Wolaco', 'Western Digital', 'Wald Berlin', "Wendy's", 'Warby Parker', 'WeChat', 'Wolfgang Puck Steak']);
            dictionary.set('X', ['Xanax', 'XFX', 'Xiaomi', 'Xerox', 'Xbox', 'XMind', 'XYZ Printing', 'X1', 'XBrand', 'Xtreme Lashes']);
            dictionary.set('Y', ['YAMAHA', 'Yeezy', 'Yasmin', 'Yves Salomon', 'Y Combinator', 'Yvonne Leon', 'Yoko London', 'Yon-Ka', 'Yamazaki Tableware', 'Y Decor']);
            dictionary.set('Z', ['Zara', 'Zovirax', "Zapp's", 'Zadig & Voltaire', 'Zeal Optics', 'ZERO GRAVITY', 'Zappos', 'Z Crackers', 'ZENDA', 'Zack Audio']);
            break;

        case 'Famous People':
            dictionary.set('A', ['Ashton Kutcher', 'Ashley Tisdale', 'Aaron Rodgers', 'Allen Iverson', 'Ariana Grande', 'Anna Kendrick', 'Alan Rickman', 'Andrew Yang', 'Anna Wintour', 'Alciia Keys']);
            dictionary.set('B', ['Beyonce', 'Britney Spears', 'Brenda Song', 'Barrack Obama', 'Ben Affleck', 'Bernie Sanders', 'Bruce Willis', 'Bill Gates', 'Brad Pitt', 'Billie Eilish']);
            dictionary.set('C', ['Chris Evans', 'Chris Hemsworth', 'Chris Pratt', 'Cole Sprouse', 'Christopher Nolan', 'Christian Bale', 'Christiano Ronaldo', 'Constance Wu', 'Chuck Norris', 'Camila Cabello']);
            dictionary.set('D', ['Dylan Sprouse', 'David Beckham', 'Daniel Radcliffe', 'Dua Lipa', 'Donald Trump', 'Dwayne Johnson', 'Dave Chapelle', 'Doja Cat', 'Donald Glover', 'Dakota Johnson']);
            dictionary.set('E', ['Elon Musk', 'Emma Watson', 'Emma Stone', 'Emilia Clarke', 'Emily Blunt', 'Eli Manning', 'Ed Sheeran', 'Elizabeth Warren', 'Elvis Presley', 'Elton John']);
            dictionary.set('F', ['Frank Sinatra', 'Freddie Mercury', 'Floyd Mayweather', 'Freddie Highmore', 'Frank Lampard', 'Frank Grillo', 'Fernando Torres', 'Forest Whitaker', 'Frank Ocean', 'Fan Bingbing']);
            dictionary.set('G', ['Gwyneth Paltrow', 'George Bush', 'Gigi Hadid', 'Gordon Ramsay', 'Gal Gadot', 'George Micahel', 'Gary Oldman', 'George Clooney', 'Guy Ritchie', 'George Lucas']);
            dictionary.set('H', ['Hailey Bieber', 'Henry Golding', 'Henry Cavill', 'Hugh Jackman', 'Hassan Minhaj', 'Henry Fonda', 'Harrison Ford', 'Hyun Bin', 'Harry Styles', 'Hillary Clinton']);
            dictionary.set('I', ['Ian McKellen', 'Ivanka Trump', 'Idris Elba', 'Ice Cube', 'Isaac Newton', 'Immanuel Kant', 'Ian Fleming', 'Iain Glen', 'Ian Somerhalder', 'Isabel Macedo']);
            dictionary.set('J', ['Jack Black', 'Joe Jonas', 'Justin Bieber', 'Jake Gyllenhaal', 'Jeffree Star', 'James Charles', 'Jay-Z', 'Justin Timberlake', 'J. K. Rowling', 'John Mayer']);
            dictionary.set('K', ['Kygo', 'Kevin Jonas', 'Kim Kardashian', 'Kanye West', 'Kylie Jenner', 'Kawhi Leonard', 'Katy Perry', 'Kobe Bryant', 'Kamala Harris', 'Kevin Spacey']);
            dictionary.set('L', ['Lamar Jackson', 'Lebron James', 'Lionel Messi', 'Lee Kuan Yew', 'Liam Hemsworth', 'Lady Gaga', 'Leonardo DiCaprio', 'Lily Collins', 'Logan Lerman', 'Liam Neeson']);
            dictionary.set('M', ['Michael Jordan', 'Michael Fassbender', 'Matthew Mcconaughey', 'Maisie Williams', 'Michelle Obama', 'Mark Zuckerberg', 'Matt Damon', 'Melania Trump', 'Megan Fox', 'Michael Bay']);
            dictionary.set('N', ['Nick Jonas', 'Natalie Dormer', 'Niall Horan', 'Nancy Pelosi', 'Natalie Portman', 'Nelson Mandela', 'Nicki Minaj', 'Nicholas Cage', 'Nina Dobrev', 'Neil Patrick Harris']);
            dictionary.set('O', ['Odell Beckham Jr', 'O. J. Simpson', 'Oprah Winfrey', 'Orlando Bloom', 'Olivia Wilde', 'Owen Wilson', 'Oscar Wilde', 'Otis Redding', 'Olivier Martinez', 'Olesya Rulin']);
            dictionary.set('P', ['Patrick Stewart', 'Peyton Manning', 'Peter Dinklage', 'Phil Jackson', 'Post Malone', 'Priyanka Chopra', 'Paul Walker', 'Pete Davidson', 'Park Seo-joon', 'Paris Hilton']);
            dictionary.set('Q', ['Quavo', 'Quentin Tarantino', 'Queen Latifah', 'Quincy Jones', 'QPark', 'Quvenzhane Wallis', 'Quinton Aaron', 'Quentin Crisp', 'Quando Rondo', 'Qgriggs']);
            dictionary.set('R', ['Robert Downey Jr.', 'Rupert Grint', 'Ryan Reynolds', 'Robert Pattinson', 'Robin Williams', 'Ryan Murphy', 'Rachel McAdams', 'Rihanna', 'Ryan Gosling', 'Rose Byrne']);
            dictionary.set('S', ['Sophie Turner', 'Steve Jobs', 'Samuel L. Jackson', 'Sam Smith', 'Sylvester Stallone', 'Shawn Mendes', 'Steven Spielberg', 'Scarlett Johansson', 'Selena Gomez', 'Sandra Bullock']);
            dictionary.set('T', ['Tom Hanks', 'Tom Cruise', 'Troye Sivan', 'Taylor Swift', 'Taylor Lautner', 'Tom Holland', 'Travis Scott', 'Terry Crews', 'Tobey Maguire', 'Tim Burton']);
            dictionary.set('U', ['Usain Bolt', 'Usher', 'Ulysses S. Grant', 'Upton Sinclair', 'Uma Thurman', 'Urmila Matondkar', 'Uday Chopra', 'Uhm Jung-hwa', 'Utkarsh Ambudkar', 'Una Stubbs']);
            dictionary.set('V', ['Vanessa Hudgens', 'Vincent van Gogh', 'Vin Diesel', 'Vladimir Putin', 'Vince Carter', 'Victoria Justice', 'Victoria Beckham', 'Viola Davis', 'Vanessa Kirby', 'Vince Vaughn']);
            dictionary.set('W', ['Will Smith', 'Woody Allen', 'Wilem Dafoe', 'Warwick Davis', 'Will Ferell', 'Will Poulter', 'Wentworth Miller', 'Woody Harrelson', 'William Shatner', 'Wes Bentley']);
            dictionary.set('X', ['XXXTentacion', 'Xi Jinping', 'Xabi ALonso', 'Xzibit', 'Xi Mingze', 'Xosha Roquemore', 'Ximena Duque', 'Xavier Serrano', 'Xander Corvus', 'Xavier Samuel']);
            dictionary.set('Y', ['Yao Ming', 'Yoko Ono', 'Yoo In-na', 'Yoo Jae-suk', 'Yo Gotti', 'Yoon Park', 'Yip Man', 'Yiruma', 'Yukio Mishima', 'Young Lyric']);
            dictionary.set('Z', ['Zion Williamson', 'Zac Efron', 'Zendaya', 'Zayn Malik', 'Zoe Saldana', 'Zachary Levi', 'Zack Snyder', 'Zoey Deutch', 'Zooey Deschanel', 'Zoey Deutch']);
            break;

        case 'Countries & Cities':
            dictionary.set('A', ['Afghanistan', 'Argentina', 'Austria', 'Albania', 'Australia', 'Austin', 'Atlanta', 'Amsterdam', 'Athens', 'Armenia']);
            dictionary.set('B', ['Bulgaria', 'Brazil', 'Belarus', 'Brunei', 'Budapest', 'Boston', 'Baltimore', 'Barcelona', 'Berlin', 'Beijing']);
            dictionary.set('C', ['China', 'Canada', 'Colombia', 'Cuba', 'Chile', 'Cairo', 'Chicago', 'Charlottesville', 'Cambridge', 'Cleveland']);
            dictionary.set('D', ['Denmark', 'Dominica', 'Delhi', 'Durham', 'Dublin', 'Detroit', 'Denpasar', 'Dallas', 'Dunkirk', 'Depok']);
            dictionary.set('E', ['Egypt', 'England', 'Estonia', 'Ecuador', 'Ethiopia', 'El Paso', 'Edinburgh', 'Eastchester', 'Elmhurst', 'Exeter']);
            dictionary.set('F', ['Finland', 'France', 'Fiji', 'Foshan', 'Formosa', 'Florence', 'Fort Lauderdale', 'Fremont', 'Fukushima', 'Fuzhou']);
            dictionary.set('G', ['Germany', 'Greece', 'Ghana', 'Guatemala', 'Georgia', 'Guangzhou', 'Gloucester', 'Glasgow', 'Gold Coast', 'Guantanamo']);
            dictionary.set('H', ['Hungary', 'Honduras', 'Haiti', 'Hamburg', 'Hampton', 'Houston', 'Hong Kong', 'Honolulu', 'Hiroshima', 'Halifax']);
            dictionary.set('I', ['India', 'Indonesia', 'Ireland', 'Israel', 'Iran', 'Indianapolis', 'Irvine', 'Istanbul', 'Ithaca', 'Italy']);
            dictionary.set('J', ['Jordan', 'Japan', 'Jamaica', 'Jaipur', 'Jersey City', 'Jacksonville', 'Jakarta', 'Johannesburg', 'Johor Bahru', 'Jerusalem']);
            dictionary.set('K', ['Kazakhstan', 'Korea', 'Kuwait', 'Kenya', 'Kosovo', 'Kuala Lumpur', 'Kyoto', 'Kansas City', 'Kawasaki', 'Kanpur']);
            dictionary.set('L', ['Laos', 'Latvia', 'Lithuania', 'Libya', 'Lebanon', 'Las Vegas', 'Los Angeles', 'London', 'Leicester', 'Liverpool']);
            dictionary.set('M', ['Malaysia', 'Mexico', 'Madagascar', 'Morocco', 'Mongolia', 'Madrid', 'Manchester', 'Miami', 'Moscow', 'Marseille']);
            dictionary.set('N', ['Nigeria', 'New Zealand', 'Netherlands', 'Norway', 'Nepal', 'New York', 'New Orleans', 'Norwich', 'Nagasaki', 'Newark']);
            dictionary.set('O', ['Oman', 'Oklahoma City', 'Oxford', 'Ontario', 'Oldenburg', 'Orlando', 'Oakland', 'Osaka', 'Ottawa', 'Omaha']);
            dictionary.set('P', ['Peru', 'Philippines', 'Portugal', 'Poland', 'Pakistan', 'Perth', 'Paris', 'Pittsburgh', 'Palembang', 'Philadelphia']);
            dictionary.set('Q', ['Qatar', 'Qingdao', 'Qalyub', 'Qom', 'Quezon', 'Quebec City', 'Quchan', 'Qarchak', 'Qatif', 'Qingzhou']);
            dictionary.set('R', ['Russia', 'Romania', 'Rwanda', 'Rampur', 'Ravenna', 'Richmond', 'Rome', 'Rio de Janeiro', 'Rawson', 'Reynosa']);
            dictionary.set('S', ['Singapore', 'Switzerland', 'Spain', 'Saudi Arabia', 'Syria', 'Surabaya', 'San Francisco', 'Seattle', 'Shanghai', 'Sri Lanka']);
            dictionary.set('T', ['Thailand', 'Taiwan', 'Turkey', 'Tunisia', 'Timor-Leste', 'Tokyo', 'Toronto', 'Tehran', 'Taipei', 'Tangerang']);
            dictionary.set('U', ['Uruguay', 'United States', 'United Kingdom', 'Ukraine', 'Uganda', 'Ufa', 'Ulsan', 'Udupi', 'Ube', 'Urayasu']);
            dictionary.set('V', ['Vietnam', 'Venezuela', 'Vanuatu', 'Valsad', 'Varna', 'Venice', 'Vancouver', 'Valencia', 'Vienna', 'Victoria']);
            dictionary.set('W', ['Waterloo', 'Warsaw', 'Wuhan', 'Wolverhampton', 'Watford', 'Washington, D.C.', 'Wells', 'Westminster', 'Worcester', 'Whitehorse']);
            dictionary.set('X', ['Xochimilco', 'Xalapa', 'Xai-Xai', 'Xuchang', 'Xiaogan', 'Xiamen', "Xi'an", 'Xining', 'Xiantao', 'Xianyang']);
            dictionary.set('Y', ['Yemen', 'Yugoslavia', 'Yokohoma', 'Yuzhou', 'Yamato', 'Yamaguchi', 'York', 'Yogyakarta', 'Yeosu', 'Yonkers']);
            dictionary.set('Z', ['Zimbabwe', 'Zambia', 'Zhangshu', 'Zhuzhou', 'Zamjan', 'Zhongshan', 'Zabol', 'Zhuji', 'Zuwarah', 'Zwolle']);
            break;

        case 'Food & Ingredients':
            dictionary.set('A', ['Artichokes', 'Asparagus', 'Apple', 'Almond', 'Avocado', 'Arugula', 'Apricot', 'Agar Agar', 'Amchoor', 'Arrowroot']);
            dictionary.set('B', ['Bacon', 'Broccoli', 'Banana', 'Bay leaves', 'Bread', 'Baking Soda', 'Blueberry', 'Butter', 'Bonito', 'Beans']);
            dictionary.set('C', ['Cheese', 'Chicken', 'Carrot', 'Corn', 'Cake', 'Chia Seeds', 'Chocolate', 'Chilli', 'Cauliflower', 'Cumin']);
            dictionary.set('D', ['Duck', 'Durian', 'Date', 'Daikon', 'Donut', 'Deviled Egg', 'Dragon Fruit', 'Dumpling', 'Dill', 'Dandelion Green']);
            dictionary.set('E', ['Eggplant', 'Egg', 'Escargot', 'Enoki', 'Eclair', 'Endive', 'Eel', 'Empanada', 'Enchiladas', 'Edamame']);
            dictionary.set('F', ['Fettuccine', 'Flax Seeds', 'Five-Spice', 'Flour', 'Fajitas', 'Furikake', 'Foie gras', 'French Fries', 'Feta Cheese', 'Figs']);
            dictionary.set('G', ['Ginger', 'Garlic', 'Gouda', 'Guanciale', 'Guacamole', 'Grape', 'Guava', 'Grapefruit', 'Garam Masala', 'Granola']);
            dictionary.set('H', ['Hamburger', 'Honeydew', 'Honey', 'Holy Basil', 'Hazelnut', 'Hummus', 'Horseradish', 'Harissa', 'Hot Dog', 'Ham']);
            dictionary.set('I', ['Ice cream', 'Idaho Potato', 'Iodized Salt', 'Inca Berry', 'Iceberg lettuce', 'Icaco', 'Ice Pops', 'Indian Mustard', 'Iberian ham', 'Ice cream cake']);
            dictionary.set('J', ['Jackfruit', 'Jalapeno', 'Jelly', 'Jasmine Rice', 'John Dory', 'Juniper Berry', 'Jellyfish', 'Jerky', 'Juneberry', 'Jaboticaba']);
            dictionary.set('K', ['Kiwi', 'Kale', 'Kobe Beef', 'Kombu', 'Kimchi', 'Kebab', 'Kava', 'Knackwurst', 'Kudzu', 'Kidney Beans']);
            dictionary.set('L', ['Lettuce', 'Lasagna', 'Lemon', 'Linguine', 'Lo Mein', 'Lobster', 'Lentil', 'Longan', 'Licorice', 'Lychee']);
            dictionary.set('M', ['Mango', 'Melon', 'Matcha', 'Milk', 'Macaroni', 'Macadamia nut', 'Mackerel', 'Mozzarella cheese', 'Mushroom', 'Mustard']);
            dictionary.set('N', ['Noodle', 'Nutmeg', 'Naan', 'Natto', 'Nutella', 'Nasi Goreng', 'Nasturtium', 'Nachos', 'Nugget', 'Nori']);
            dictionary.set('O', ['Orange', 'Onion', 'Oregano', 'Octopus', 'Olive', 'Oats', 'Oyster', 'Okra', 'Oatmeal', 'Oca']);
            dictionary.set('P', ['Pepper', 'Potato', 'Porridge', 'Pork', 'Prawn', 'Pumpkin', 'Pizza', 'Pancake', 'Peanut', 'Pineapple']);
            dictionary.set('Q', ['Quail', 'Quesadilla', 'Quinoa', 'Queso', 'Quavers', 'Quiche', 'Quanelle', 'Quahog', 'Quorn', 'Quandong']);
            dictionary.set('R', ['Ronde', 'Rosemary', 'Ramen', 'Ravioli', 'Rice', 'Radish', 'Rawon', 'Raisin', 'Rhubarb', 'Rye']);
            dictionary.set('S', ['Sugar', 'Salt', 'Steak', 'Sushi', 'Salmon', 'Spaghetti', 'Strawberry', 'Sausage', 'Scallion', 'Spinach']);
            dictionary.set('T', ['Tuna', 'Truffle', 'Tapioca', 'Thyme', 'Turmeric', 'Taco', 'Tomato', 'Tempura', 'Tiramisu', 'Tofu']);
            dictionary.set('U', ['Ube', 'Udon', 'Unagi', 'Urchin', 'Upma', 'Ugali', 'Ugli fruit', 'Uunijuusto', 'Ukha', 'Uszka']);
            dictionary.set('V', ['Vanilla', 'Venison', 'Vinegar', 'Veal', 'Vermicelli', 'Vodka', 'Vermouth', 'Vichyssoise', 'Vada pav', 'Velvet beans']);
            dictionary.set('W', ['Watermelon', 'Walnut', 'Wonton', 'Wintermelon', 'Wolfberry', 'Wheat Bread', 'Wagyu Beef', 'Watercress', 'Wasabi', 'Whisky']);
            dictionary.set('X', ['XO sauce', 'Xoi', 'Xinomavro grape', 'Xavier steak', 'Xanthan gum', 'Xacuti', 'Xylitol', 'Xiao long bao', 'Xouba', 'Xnipec']);
            dictionary.set('Y', ['Yam', 'Yakitori', 'Yeast', 'Yogurt', 'Yardlong beans', 'Yuzu', 'Yiros', 'Yabby', 'Yautia', 'Yam beans']);
            dictionary.set('Z', ['Zucchini', 'Zinfandel', 'Zuccotto', 'Zwieback', 'Zampone', 'Zoni', 'Zeppole', 'Zabaione', 'Zerde', 'Zimtsterne']);
            break;

        case 'Schools (All Levels)':
            dictionary.set('A', ['Anderson Secondary School', 'ACS Independent', 'Arizona State University', 'Alabama State University', 'Anglican High School', 'Admiralty Secondary School', 'Austin College', 'Abraham Lincoln University', 'Alma College', 'Allen University']);
            dictionary.set('B', ['British International School', 'Brown University', 'Boston University', 'Babson College', 'Barnard College', 'Bina Bangsa School', 'Boston College', 'Bridgewater College', 'Butler University', 'Buffalo State College']);
            dictionary.set('C', ['Columbia University', 'Catholic Junior College', 'Cornell University', 'Canisius College', 'Caltech', 'Cal Poly Pomona', 'Campbell University', 'Cambridge College', 'City College', 'Clarkson University']);
            dictionary.set('D', ['Duke University', 'Dartmouth College', 'Dakota College', 'Dickinson State University', 'Drexel University', 'DePaul University', 'Dunman Secondary School', 'Dunearn Secondary School', 'DeSales University', 'DeVry University']);
            dictionary.set('E', ['Eunoia Junior College', 'Eastwick College', 'Evergreen Secondary School', 'Elmhurst College', 'Emerson College', 'Edison State College', 'Empire Beauty School', 'Everglades University', 'Emory University', 'Endicott College']);
            dictionary.set('F', ['Fordham University', 'FIT', 'Fudan University', 'Fuji University', 'Fairfield University', 'Foothill College', 'Fuhua Secondary School', 'Fremont College', 'Friends University', 'Fukushima College']);
            dictionary.set('G', ['GM International School', 'Georgetown University', 'Georgia State University', 'Goodwin College', 'Grayson College', 'Gifu University', 'Gunma University', 'Gan Eng Seng School', 'Greendale Secondary School', 'Greenridge Secondary School']);
            dictionary.set('H', ['Hwa Chong Institution', 'Harvard University', 'HKU', 'Hamilton College', 'Hallmark University', 'Huntington University', 'Howard University', 'Hua Yi Secondary School', 'Hougang Secondary School', 'Henry Ford College']);
            dictionary.set('I', ['Imperial College London', 'Innova Junior College', 'Indiana University', 'Illinois State University', 'Idaho State University', 'Iowa State University', 'Ivy Tech Community College', 'Iona College', 'Ithaca College', 'Infinity College']);
            dictionary.set('J', ['Jakarta Intercultural School', 'John Hopkins University', 'Julliard School', 'Jackson Community College', 'Johnson University', 'Jurong Secondary School', 'Junyuan Secondary School', 'John F. Kennedy High School', 'John Brown University', 'Jones College']);
            dictionary.set('K', ['Korea University', 'Kyoto University', 'Keiser University', 'KAIST', 'Kansas State University', 'King College', 'Kent Ridge Secondary School', 'Kranji Secondary School', 'Knox College', 'Kent State University']);
            dictionary.set('L', ['LMU', 'LASALLE College of the Arts', 'Lehigh University', 'Lebanon College', 'Louisiana Tech University', 'LSE', 'London Metropolitan University', 'Long Beach City College', 'Lakeside School', 'Lincoln Memorial University']);
            dictionary.set('M', ['Mountainview Christian School', 'MIT', "Methodist Girls' School", 'Monash University', 'Mayflower Secondary School', 'Maris Stella High School', 'Manhattan College', 'Marymount University', 'Miami Dade College', 'Michigan State University']);
            dictionary.set('N', ['NYU', 'NUS', 'National High Jakarta School', 'NTU', 'Nanyang Junior College', 'NUS High School', 'Neumann University', 'Nasional Montessori', 'National Junior College', 'Ngee Ann Secondary School']);
            dictionary.set('O', ['Occidental College', 'Oakland University', 'Ohio State University', 'Ottawa University', 'Outram Secondary School', 'Osaka University', 'Okinawa University', 'Oxford College', 'Ohio Technical College', 'Oregon State University']);
            dictionary.set('P', ['Princeton University', 'Peking University', 'Pepperdine University', 'Parsons School of Design', 'Phillips Exeter Academy', 'PSB Academy', 'Pennsylvania State University', 'Purdue University', 'Presbyterian High School', 'Pasir Ris Secondary School']);
            dictionary.set('Q', ['Queenstown Secondary School', 'Queen City College', 'Quincy College', "Queen's University", 'Quincy University', 'Quinnipiac University', 'Quiroga College', 'Queensway Secondary School', 'Qingdao University', 'Qatar University']);
            dictionary.set('R', ['Richmond University', 'Raffles Institution', 'Royal College of Music', 'Royal College of Art', 'Rhodes College', 'Royal College of Surgeons', 'River Valley High School', "Raffles Girls' School", 'Rochester University', 'Renaissance University']);
            dictionary.set('S', ['San Francisco State University', 'Sekolah Pelita Harapan', 'SIS', 'SMU', 'Seoul National University', 'St. Ursula Catholic School', 'Stanford University', 'Syracuse University', 'Sapporo University', "Singapore Chinese Girls' School"]);
            dictionary.set('T', ['Tsinghua University', 'Tianjin University', 'Toho University', 'Tampines Secondary School', 'Temasek Junior College', 'Texas College', 'Thomas Jefferson University', 'Tokyo Institute of Technology', 'Taylor University', "Tanjong Katong Girls' School"]);
            dictionary.set('U', ['UCLA', 'UC Berkeley', 'University of Notre Dame', 'University of Indonesia', 'UCSD', 'University of Cambridge', 'University of Pennsylvania', 'UT Austin', 'University of London', 'Unity Secondary School']);
            dictionary.set('V', ['Victoria Junior College', 'Vermont Law School', 'Virginia State University', 'Victoria University', 'Vietnam National University', 'Villanova University', 'Veritas University', 'Vancouver Island University', 'Vassar College', 'Valencia College']);
            dictionary.set('W', ['Waseda University', 'Watchung School', 'Wuhan University', 'Walsh University', 'Washington State University', 'Webster University', 'Wells College', 'Wilkes University', 'Wesley College', 'Whitley Secondary School']);
            dictionary.set('X', ['Xiamen University', "Xi'an Jiaotong University", 'Xavier University', 'Xenon Academy', 'Xinmin Secondary School', 'Xuzhou Medical University', 'Xiangnan University', 'Xijing University', 'Xinyu University', 'Xingtai University']);
            dictionary.set('Y', ['Yale University', 'Yishun Junior College', 'Yonsei University', 'Yeungnam University', 'Yishun Secondary School', 'Yamaguchi University', 'Yangtze University', 'York College', 'York University', 'Yunnan University']);
            dictionary.set('Z', ['Zhonghua Secondary School', 'Zanjan University', 'Zane State College', 'Zhejiang University', 'Zhengzhou University', 'Zanzibar University', 'Zarqa University', 'Zhaotong University', 'Zintan University', 'Zetech University']);
            break;

        case 'Songs':
            dictionary.set('A', ["As if It's Your Last", 'Airplanes', 'A Sky Full of Stars', 'American Dream', 'Antisocial', 'American Pie', 'All of Me', 'All Star', 'Apologize', 'A Thousand Years']);
            dictionary.set('B', ['Betty', 'Bad Romance', 'Baby', 'Back in Black', 'Beauty and a Beat', 'Burn The House Down', 'Boy With Luv', 'Big Shot', 'Bad Guy', 'Better Now']);
            dictionary.set('C', ['Closer', 'Charlie Brown', 'Castle On the Hill', 'Cold in LA', 'Circles', 'Counting Stars', 'Check Yes, Juliet', 'Congratulations', 'CROWN', 'Comethru']);
            dictionary.set('D', ['DDU-DU DDU-DU', 'Drive Safe', 'Daylight', 'Day 1', 'Dear Winter', 'Dancing Queen', 'Down', 'Dynamite', 'DNA', 'Danza Kuduro']);
            dictionary.set('E', ['Empire State of Mind', 'Everglow', 'Eenie Meenie', 'Euphoria', 'Everything I Am', 'ELEMENT', 'Eastside', 'Electricity', 'Elevated', 'Every Hour']);
            dictionary.set('F', ['FANCY', 'Fifteen', 'Forever Young', 'Feelings', 'Friends', 'Faded', 'Footloose', 'FAKE LOVE', 'Fearless', 'Feedback']);
            dictionary.set('G', ['Guilty Pleasure', 'God Is A Woman', 'Goodbyes', 'Good Guys', 'Gangnam Style', 'Good Years', 'Graveyard', 'Good As Hell', 'Glorious', 'Girls Like You']);
            dictionary.set('H', ['Hall of Fame', 'Happier', 'Heaven', 'Hot N Cold', 'How You Like That', 'Homecoming', 'Humble', 'Hear Me Calling', 'How Can I Forget', 'Higher Love']);
            dictionary.set('I', ['Invisible String', 'I Like Me Better', 'Intentions', 'I Want It That Way', 'In The End', 'Iridescent', 'IDOL', 'I.F.L.Y', 'I Miss You', 'Ink']);
            dictionary.set('J', ['Just A Dream', 'Jackie Chan', 'Jar of Hearts', 'Juice', 'Jealous', "Jermaine's Interlude", 'Jesus Is Lord', 'Jesus Walks', 'John Wayne', 'Joy To The World']);
            dictionary.set('K', ['Kiss and Make Up', 'Kill This Love', 'Karma', 'Kenangan Terindah', 'Keep The Family Close', 'Kaleidoscope', 'Know Your Worth', 'Kung Fu Fighting', "King's Dead", 'Kentucky Rain']);
            dictionary.set('L', ['Lucid Dreams', 'Lost in Japan', 'Love Yourself', 'Last Hurrah', 'Lowkey', 'Lose Somebody', 'Living on a Prayer', 'Love Story', 'Leaving California', 'LOYALTY']);
            dictionary.set('M', ['My Love', 'Mo Bamba', 'Mine', 'Mean It', 'Malibu Nights', 'Mirrorball', 'Mamma Mia', 'MIC Drop', 'Make It Right', 'Mad']);
            dictionary.set('N', ['Noots', 'Numb', 'No Guidance', 'No Promises', 'Nervous', 'New Freezer', 'Never Say Never', 'No Judgement', 'New Light', 'No Sleep']);
            dictionary.set('O', ['One Thing Right', 'Ocean Eyes', 'Overture', 'Otherside', 'Outta My Head', 'On God', 'Only Human', 'One Way to Tokyo', 'Old Town Road', 'On Top of the World']);
            dictionary.set('P', ['Paradise', 'Payphone', 'Party in the USA', 'Pray For Me', 'Peng You', 'Perfect', 'Photograph', 'Psycho', 'Paranoid', 'Plain Jane']);
            dictionary.set('Q', ['Quarantine', 'Questions', 'Quicksand', 'Quitter', 'Quite Miss Home', 'Queen', 'Quasimodo', 'Quarter Past Midnight', 'Quasar', 'Quick']);
            dictionary.set('R', ['ROXANNE', 'Roar', 'Red', 'Rain On Me', 'Rocket Man', 'Rise', "Really Don't Care", 'Rewrite The Stars', 'Red Lights', 'Ritual']);
            dictionary.set('S', ['Solo', 'Saturday Nights', 'Strawberries & Cigarettes', 'Shape Of You', 'Superhero', 'Sunday Best', 'Stitches', 'Secrets', 'Stuck With U', 'Swear It Again']);
            dictionary.set('T', ['Thick and Thin', 'Takeaway', 'Take on Me', 'Thanks for the Memories', 'Titanium', 'The Archer', 'Thank U, Next', 'Tong Hua', 'Talk', 'Treat You Better']);
            dictionary.set('U', ['Uptown Girl', 'Use This Gospel', 'Umbrella', 'UFO', 'Unbelievable', 'Undrunk', 'Unbroken', 'Undecided', 'Under The Sea', 'Unforgettable']);
            dictionary.set('V', ['Venom', 'Viva La Vida', 'Vato', 'Venus', 'Versace on the Floor', 'Video Girl', 'Vienna', 'Vida 23', 'Views', 'Violet Hill']);
            dictionary.set('W', ['Wait for You', 'Whistle', 'Warm On a Cold Night', 'Wrecking Ball', 'Weak', 'Without Me', 'We Will Rock You', "We Didn't Start the Fire", 'Welcome to the Black Parade', "What is Love"]);
            dictionary.set('X', ['X', 'XXX', 'XO', 'Xanny', 'Xanadu', 'X2', 'X Offender', 'X Marks the Spot', 'Xoxoxo', 'Xscape']);
            dictionary.set('Y', ['Young Dumb & Broke', 'Yellow', 'YMCA', 'You Spin Me Round', 'You Belong With Me', 'You Need To Calm Down', 'You Will Be Found', 'Youngblood', 'YOSEMITE', 'You & Me']);
            dictionary.set('Z', ['Zack And Codeine', 'Zero', 'Zebras and Airplanes', 'Zeze', 'Zaar', 'Zamboni', 'Zeitgeist', 'Zombie', 'Zoo Station', 'Zoosk Girl']);
            break
        /*case 'Schools (All Levels)':
            dictionary.set('A', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('B', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('C', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('D', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('E', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('F', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('G', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('H', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('I', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('J', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('K', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('L', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('M', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('N', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('O', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('P', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('Q', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('R', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('S', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('T', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('U', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('V', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('W', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('X', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('Y', ['', '', '', '', '', '', '', '', '', '']);
            dictionary.set('Z', ['', '', '', '', '', '', '', '', '', '']);
            break; */
    }
})

// Event listener when the letter button is clicked
button_letter.addEventListener('click', () => {
    //Disabling the category generator and letter generator button so that the user cannot generate a new category
    //or a new letter after generating a random letter
    button_category.disabled = true;
    button_letter.disabled = true;

    //Disabling the difficulty level options once the user generates a letter to prevent him/her
    //from changing the difficulty level midway
    level.forEach((item) => {
        item.disabled = true;
    })

    //Undoing the disabling of the answer box of user once the random letter is generated so that user
    //can type in an answer
    main_answer.disabled = false;

    //Clearing the previous outside responses everytime the letter is generated
    for (i = 0; i < num_of_friends; i++) {
        outside_responses[i].value = null;
    }

    //Resetting user's answer textbox everytime the letter generator button is clicked
    main_answer.value = null;
    main_answer.style = "color: default; background-color: default;";

    //Hiding the commentator box until the user writes an answer and presses the answer key
    comments.hidden = true;

    //Generating a random letter
    let random_int = Math.floor(Math.random() * (upper_alphabet - lower) + lower);
    letter_display.value = alphabet[random_int];

    //Emptying the array of unique numbers to refresh the random numbers everytime the button is clicked
    unique_numbers.length = 0;

    //Filling the unique numbers array with a list of random numbers that correspond to the answers in dictionary
    do {
        let random_int_2 = Math.floor(Math.random() * (upper_responses - lower) + lower);
        if (unique_numbers.includes(random_int_2)) {
          //pass
        }
        else {
          unique_numbers.push(random_int_2);
        }
    }
    while (unique_numbers.length != num_of_friends);

    //Hiding the values of the outside people
    for (i = 0; i < num_of_friends; i++) {
        outside_responses[i].type = "hidden";
    }

    //Controlling the outcome of the answers based on the chosen difficulty level option
    for (option of level) {
        if (option.checked == true) {
            level_value = option.value;
            break;
        }
    }

    let time_delay; // Variable to denote the time delay/interval of the outside responses
    // Variable to denote the comment made if the user did not enter any answer in time
    let empty_comment = `Too late to enter ${String.fromCodePoint(0x1F637)} No Answer = 2 shots! ${String.fromCodePoint(0x1F376)}`;

    //Revealing the speed of outside people's responses based on the chosen difficulty level
    switch (level_value) {
        case '1':
            time_delay = 10000;
            outside_responses.forEach(response_delay, time_delay);
            empty_main_response(empty_comment, time_delay + 50);
            break;
        case '2':
            time_delay = 3000;
            response_interval(time_delay);
            empty_main_response(empty_comment, num_of_friends * time_delay + 50);
            break;
        case '3':
            time_delay = 1000;
            response_interval(time_delay);
            empty_main_response(empty_comment, num_of_friends * time_delay + 50);
            break;
        case '4':
            time_delay = 300;
            response_interval(time_delay);
            empty_main_response(empty_comment, num_of_friends * time_delay + 50);
            break;
        case '5':
            time_delay = 300;
            gender_comment = gender_discrepancy('bro', 'sis')
            empty_comment = `Too slow!! You'll never be fast enough ${gender_comment}`;
            outside_responses.forEach(response_delay, time_delay);
            empty_main_response(empty_comment, time_delay + 50, main_disabled = false);
            break;
    }
})

//Automated Response after user keys in answer
main_answer.addEventListener('keyup', (e) => {
    if (e.keyCode == 13) {
        //Revealing the comments in the commentator box once the user keys in an answer
        comments.hidden = false;

        //Disabling the main answer box so that the user cannot change his/her answer once it is entered
        main_answer.disabled = true;
        gender_value = gender_discrepancy('#446491', '#59405c')
        main_answer.style = `color: #e2f3f5; background-color: ${gender_value};`

        //Undoing the disabling of the generate category and generate letter  button once the user enters an answer
        //to allow the user to change categories or letters to however he/she would like
        button_category.disabled = false;
        button_letter.disabled = false;

        //Undoing the disabling of the difficulty level once the user enters an answer
        level.forEach((item) => {
            item.disabled = false;
        })

        //Binary variable to denote whether or not the user succeeded in beating some of the bots
        let win;

        //Binary variable for denoting whether the user typed in the same answer as one of the outside answers before they did
        //False means that the user typed the answer first before any outside answer
        //True means that one of the outside people revealed that answer first before the user entered it
        let same_ans_last = false;

        //This variable is another binary variable used to denote whether or not the user has to take an optional shot
        //The user has to take another shot if the user came in last and typed a same answer as any one of the outside answers
        let optional_shot;

        if (main_answer.value[0].toLowerCase() == letter_display.value.toLowerCase()) {
            //Responses for the Easy difficulty level
            if (level_value == '1') {
                if (outside_responses[num_of_friends - 1].type == 'hidden') {
                    win = true;
                    optional_shot = false;
                    gender_comment = gender_discrepancy('good sir', 'lady')
                    comments.innerHTML = `YOU BEAT EVERYONE! Very fast fingers you have there my ${gender_comment}. ${String.fromCodePoint(0x1F60F)}`;
                }
                else {
                    win = false;
                    optional_shot = true;
                    comments.innerHTML = 'Last place, gotta take a shot! Better luck next time :((';
                }
            }
            //Responses for the Medium, Difficult, and Insane difficulty level
            else if (level_value == '2' || level_value == '3' || level_value == '4'){
                if (!outside_responses[0].value) {
                    win = true;
                    optional_shot = false;
                    switch (level_value) {
                        case '2':
                            comments.innerHTML = "WOW First place! Not bad not bad! You should move up a level!";
                            break;
                        case '3':
                            comments.innerHTML = "WOAH don't smash your keyboard too hard ok but gj!";
                            break;
                        case '4':
                            gender_comment = gender_discrepancy('guy', 'gal')
                            comments.innerHTML = `You are definitely on steroids my ${gender_comment}. Chill, it's just a game`;
                            break;
                    }
                }
                else if (!outside_responses[num_of_friends - 1].value) {
                    for (i = 0; i < num_of_friends; i++) {
                        if (main_answer.value.toLowerCase() == outside_responses[i].value.toLowerCase()) {
                            win = false;
                            same_ans_last = true;
                            comments.innerHTML = `You're not last but DAMNIT! ${names[i].innerHTML} ${String.fromCodePoint(0x1F621)} took
                                                  your answer before you! Grrrr!! Guess its time to take a shot ${String.fromCodePoint(0x1F610)}`;
                            break;
                        }
                    }
                    if (same_ans_last == false) {
                        win = true;
                        optional_shot = false;
                        comments.innerHTML = "You're not last place YAY!!";
                    }
                }
                else {
                    win = false;
                    optional_shot = true;
                    comments.innerHTML = `YOU GOT LAST PLACE! TAKE A SHOT! ${String.fromCodePoint(0x1F376)}`;
                }
            }
            //Responses for the Impossible difficulty level
            else {
                if (outside_responses[num_of_friends - 1].type == 'hidden') {
                    win = true;
                    optional_shot = false;
                    regex_pattern = new RegExp('\\w+\\b');
                    let first_name = main_name.innerHTML.match(regex_pattern)[0];
                    comments.innerHTML = `YOU must be a G! That or you're a hacker and you see this javascript file. Yeah ${first_name}, I see you I see
                                          you ${String.fromCodePoint(0x1F928)}`;
                }
                else {
                    win = false;
                    optional_shot = true;
                    comments.innerHTML = "Just give up; you can't win this. And take one shot while you're at it";
                }
            }
        }
        else {
            win = false;
            gender_comment = gender_discrepancy('guy', 'gal')
            comments.innerHTML = `Thats not the right start letter my ${gender_comment}. TAKE A SHOT! ${String.fromCodePoint(0x1F376)}`;
        }

        //Changing the background color of comments to green or red depending on whether or not the user won/lost
        if (win == true) {
            comments.style = "background-color: #a7ff83;";
        }
        else {
            comments.style = "background-color: #ff5959";
        }

        //Revealing all the outside responses once the user enters in a value in his/her answer box
        //so that the user does not have to wait to see what everyone wrote
        for (i = 0; i < num_of_friends; i++) {
            outside_responses[i].value = dictionary.get(letter_display.value)[unique_numbers[i]];
            outside_responses[i].type = "text";
            //Code block for displaying additional comment when an outside response has the same answer as the
            //user's answer but the user managed to type the answer first
            if (same_ans_last == false && main_answer.value.toLowerCase() == outside_responses[i].value.toLowerCase()) {
                if (optional_shot == false) {
                    comments.innerHTML += ` And it looks like you even beat ${names[i].innerHTML} who got the same answer as you! ${String.fromCodePoint(0x270C)}`;
                }
                else {
                    comments.innerHTML += ` And take another shot because ${names[i].innerHTML} beat you to your answer ${String.fromCodePoint(0x1F92E)}`;
                }
            }
        }
    }
})
