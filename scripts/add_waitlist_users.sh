#!/bin/bash

# Script to add realistic users to waitlists for events
# Fills events to 20%-90% capacity with real-looking email addresses

API_URL="http://localhost:9050"
COOKIE_FILE="/tmp/linea_cookies"

# Realistic email domains and names for generating test users
DOMAINS=("gmail.com" "yahoo.com" "hotmail.com" "outlook.com" "icloud.com" "protonmail.com" "fastmail.com" "zoho.com")
FIRST_NAMES=("Alex" "Jordan" "Taylor" "Morgan" "Casey" "Riley" "Avery" "Quinn" "Sage" "River" "Blake" "Cameron" "Drew" "Emery" "Finley" "Hayden" "Jamie" "Kendall" "Logan" "Parker" "Reese" "Sage" "Skyler" "Tatum" "Valentina" "Willow" "Xavier" "Yara" "Zoe" "Aaron" "Bella" "Carlos" "Diana" "Elena" "Felix" "Grace" "Henry" "Isabella" "Jake" "Kate" "Liam" "Maya" "Noah" "Olivia" "Paul" "Quinn" "Ruby" "Sam" "Tina" "Uma" "Victor" "Wendy" "Xander" "Yuki" "Zara")
LAST_NAMES=("Smith" "Johnson" "Williams" "Brown" "Jones" "Garcia" "Miller" "Davis" "Rodriguez" "Martinez" "Hernandez" "Lopez" "Gonzalez" "Wilson" "Anderson" "Thomas" "Taylor" "Moore" "Jackson" "Martin" "Lee" "Perez" "Thompson" "White" "Harris" "Sanchez" "Clark" "Ramirez" "Lewis" "Robinson" "Walker" "Young" "Allen" "King" "Wright" "Scott" "Torres" "Nguyen" "Hill" "Flores" "Green" "Adams" "Nelson" "Baker" "Hall" "Rivera" "Campbell" "Mitchell" "Carter" "Roberts")

# Function to generate a random email
generate_email() {
    local first_name=${FIRST_NAMES[$RANDOM % ${#FIRST_NAMES[@]}]}
    local last_name=${LAST_NAMES[$RANDOM % ${#LAST_NAMES[@]}]}
    local domain=${DOMAINS[$RANDOM % ${#DOMAINS[@]}]}
    local number=$((RANDOM % 100))
    
    # Sometimes add numbers or variations
    if [ $((RANDOM % 3)) -eq 0 ]; then
        echo "${first_name,,}.${last_name,,}${number}@${domain}"
    elif [ $((RANDOM % 3)) -eq 1 ]; then
        echo "${first_name,,}${last_name,,}@${domain}"
    else
        echo "${first_name,,}.${last_name,,}@${domain}"
    fi
}

# Function to generate a random name
generate_name() {
    local first_name=${FIRST_NAMES[$RANDOM % ${#FIRST_NAMES[@]}]}
    local last_name=${LAST_NAMES[$RANDOM % ${#LAST_NAMES[@]}]}
    echo "${first_name} ${last_name}"
}

# Function to generate a business name
generate_business() {
    local business_types=("Design Studio" "Creative Agency" "Fashion House" "Art Gallery" "Design Lab" "Studio" "Workshop" "Atelier" "Boutique" "Collective")
    local adjectives=("Modern" "Creative" "Urban" "Elegant" "Contemporary" "Innovative" "Artistic" "Stylish" "Chic" "Sophisticated")
    local nouns=("Design" "Studio" "Works" "Lab" "Space" "Collective" "Group" "Team" "House" "Agency")
    
    local adjective=${adjectives[$RANDOM % ${#adjectives[@]}]}
    local noun=${nouns[$RANDOM % ${#nouns[@]}]}
    local type=${business_types[$RANDOM % ${#business_types[@]}]}
    
    if [ $((RANDOM % 2)) -eq 0 ]; then
        echo "${adjective} ${noun} ${type}"
    else
        echo "${adjective} ${type}"
    fi
}

# Function to add a user to waitlist
add_to_waitlist() {
    local event_id="$1"
    local email="$2"
    local name="$3"
    local business="$4"
    local status="$5"
    
    echo "Adding ${email} to waitlist for event ${event_id}..."
    
    local response=$(curl -s -X POST "${API_URL}/api/owner/events/${event_id}/waitlist" \
        -H "Content-Type: application/json" \
        -b "$COOKIE_FILE" \
        -d "{
            \"email\": \"${email}\",
            \"name\": \"${name}\",
            \"businessName\": \"${business}\",
            \"status\": \"${status}\"
        }")
    
    if echo "$response" | jq -e '.id' >/dev/null 2>&1; then
        echo "✅ Added ${email} successfully"
        return 0
    else
        echo "❌ Failed to add ${email}: $response"
        return 1
    fi
}

# Function to get events
get_events() {
    echo "📋 Fetching events..."
    curl -s "${API_URL}/api/owner/events" -b "$COOKIE_FILE" | jq -r '.events[] | "\(.id)|\(.title)|\(.capacity // 0)|\(.currentWaitlist // 0)"'
}

# Function to calculate how many users to add
calculate_users_to_add() {
    local capacity="$1"
    local current="$2"
    local target_percentage="$3"
    
    if [ "$capacity" -eq 0 ]; then
        # For unlimited capacity events, add 20-50 users
        echo $((20 + RANDOM % 31))
    else
        local target_count=$((capacity * target_percentage / 100))
        local to_add=$((target_count - current))
        if [ $to_add -lt 0 ]; then
            echo 0
        else
            echo $to_add
        fi
    fi
}

# Main execution
echo "🚀 Adding realistic users to event waitlists..."

# Check if we have a valid session
if [ ! -f "$COOKIE_FILE" ]; then
    echo "❌ No session found. Please log in first."
    echo "Run: curl -c $COOKIE_FILE -X POST \"$API_URL/auth/dev/login\" -H \"Content-Type: application/json\" -d '{\"email\":\"admin@linea.dev\",\"role\":\"OWNER\"}'"
    exit 1
fi

# Get events
events=$(get_events)
if [ -z "$events" ]; then
    echo "❌ No events found or API not accessible"
    exit 1
fi

echo "📊 Events found:"
echo "$events" | while IFS='|' read -r id title capacity current; do
    echo "  - $title (Capacity: $capacity, Current: $current)"
done

echo ""
echo "🎯 Adding users to waitlists..."

# Process each event
echo "$events" | while IFS='|' read -r event_id title capacity current; do
    echo ""
    echo "📅 Processing: $title"
    echo "   Capacity: $capacity, Current waitlist: $current"
    
    # Calculate target percentage (20% to 90%)
    target_percentage=$((20 + RANDOM % 71))
    users_to_add=$(calculate_users_to_add "$capacity" "$current" "$target_percentage")
    
    echo "   Target: ${target_percentage}% (${users_to_add} users to add)"
    
    if [ "$users_to_add" -eq 0 ]; then
        echo "   ✅ Already at or above target"
        continue
    fi
    
    # Add users with different statuses
    local confirmed_count=0
    local pending_count=0
    local cancelled_count=0
    
    for ((i=1; i<=users_to_add; i++)); do
        email=$(generate_email)
        name=$(generate_name)
        business=$(generate_business)
        
        # Determine status (80% pending, 15% confirmed, 5% cancelled)
        local status_rand=$((RANDOM % 100))
        if [ $status_rand -lt 80 ]; then
            status="PENDING"
            pending_count=$((pending_count + 1))
        elif [ $status_rand -lt 95 ]; then
            status="CONFIRMED"
            confirmed_count=$((confirmed_count + 1))
        else
            status="CANCELLED"
            cancelled_count=$((cancelled_count + 1))
        fi
        
        # Add user to waitlist
        if add_to_waitlist "$event_id" "$email" "$name" "$business" "$status"; then
            echo "   Progress: $i/$users_to_add"
        fi
        
        # Small delay to avoid overwhelming the API
        sleep 0.1
    done
    
    echo "   ✅ Completed: $pending_count pending, $confirmed_count confirmed, $cancelled_count cancelled"
done

echo ""
echo "🎉 Waitlist population completed!"
echo "📊 Summary:"
echo "$events" | while IFS='|' read -r id title capacity current; do
    echo "  - $title: $current users on waitlist"
done
