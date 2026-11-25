import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/election/election_entry.dart';

part 'election_collection.g.dart';

/// Election Collection
@JsonSerializable(includeIfNull: false)
class ElectionElectionCollection {
  const ElectionElectionCollection({required this.elections});
  final List<ElectionElectionEntry> elections;

  factory ElectionElectionCollection.fromJson(Map<String, dynamic> json) => _$ElectionElectionCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionElectionCollectionToJson(this);
}
