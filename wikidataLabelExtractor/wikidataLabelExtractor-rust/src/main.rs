use std::{env, fs, io::Write};

use regex::Regex;
use wikidata::{Entity, Lang, Qid};

fn main() {
    let args: Vec<String> = env::args().collect();
    let option = &args[1];
    let ids: Vec<u64> = match option.as_ref() {
        "file" => {
            let file_path = &args[2];
            println!("Reading {file_path}");
            Regex::new(r"\d+")
                .unwrap()
                .captures_iter(&fs::read_to_string(file_path).unwrap())
                .map(|s| s.get(0).unwrap().as_str().parse().unwrap())
                .collect()
        }
        "--" => {
            let list_str = &args[2..].join(",");
            println!("Got {list_str}");
            Regex::new(r"\d+")
                .unwrap()
                .captures_iter(list_str)
                .map(|s| s.get(0).unwrap().as_str().parse().unwrap())
                .collect()
        }
        s => panic!("Invalid option {s}"),
    };
    let mut out = fs::File::create("out.txt").unwrap();
    let enlang = Lang("en".to_owned());
    ids.iter().for_each(|&id| {
        print!("Getting Q{id} .. ");
        let res = reqwest::blocking::get(Qid(id).json_url()).unwrap();
        let text = res.text().unwrap();
        if text.contains("<h1>Not Found</h1><p>No entity with ID ") {
            println!("Item not found");
            return;
        }
        let ent = Entity::from_json(serde_json::from_str(&text).unwrap()).unwrap();
        let mut labels = ent.labels;
        let count = labels.len();
        let enlabel = labels.remove(&enlang).unwrap();
        print!("Found {} with {} languages", enlabel, count);
        let mut vec: Vec<_> = labels
            .iter()
            .filter(|(lang, _)| lang.0.len() == 2)
            .collect();
        vec.sort();
        vec.insert(0, (&enlang, &enlabel));
        vec.iter().for_each(|(lang, label)| {
            let _ = out.write(format!("{}:{}\n", lang.0, label).as_bytes());
        });
        let _ = out.write(format!("wikidata:en:Q{id}\n\n").as_bytes());
        println!(", wrote {}", vec.len());
    });
}
