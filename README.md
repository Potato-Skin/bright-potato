## Decisions Decisions

Day 23 / March 18

Models (Super or Not)

User
   email -> String (required, unique) -> // !TODO Validation
   password -> String (required, minChar (8))
   name -> String (required)
   username -> String (required, unique)
   location (ENUM: Berlin, Amsterdam, Den Haag, Canary Islands, Madrid, Dubai, Nuremberg, Africa, Utrecht)
   shortBio -> String 
   profilePic -> String, (required) -> set default
   predefine categories?
   securityQuestion?

Event
   name -> String (required, minChar (10))
   location (ENUM: Berlin, Amsterdam, Den Haag, Canary Islands, Madrid, Dubai, Nuremberg, Africa, Utrecht)
   date -> String / Date
   attendees -> (string[] (user names)) !! WILL DEF. CHANGE
   venue -> String (required)
   mainPic -> string
   organizer: user name !! WILL DEF. CHANGE
   maxAttendees -> Number
   slug: String -> (required, unique)
   fee -> String 
   description -> String (required, minChar (20?))

Organization
   name -> String (required (minChar (6)), unique)
   members -> (string[] user names) -> WILL CHANGE
   events -> (string [event slugs])