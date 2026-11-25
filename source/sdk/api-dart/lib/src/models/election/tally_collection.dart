import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/election/tally_entry.dart';

part 'tally_collection.g.dart';

/// Tally Collection
@JsonSerializable(includeIfNull: false)
class ElectionTallyCollection {
  const ElectionTallyCollection({required this.tallies});
  final List<ElectionTallyEntry> tallies;

  factory ElectionTallyCollection.fromJson(Map<String, dynamic> json) => _$ElectionTallyCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionTallyCollectionToJson(this);
}
