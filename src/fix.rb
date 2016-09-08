airports = File.readlines("usa-airports.txt")

dont_use = ["Army", "Navy", "Naval", "Base", "Marine", "Facility", "Airstrip", "Heliport", "STOL", "Hospital", "Animal", "Emergency"]
airports.map! do |line|
  if dont_use.any?{|word| line.include?(word)}
    returning = ""
  else
    returning = line
  end
  returning
end

File.open("usa-airports.txt", "w") {|file| file.write(airports.join) }
