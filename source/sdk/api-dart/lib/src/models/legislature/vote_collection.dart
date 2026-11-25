import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legislature/vote_entry.dart';

part 'vote_collection.g.dart';

/// Vote Collection
@JsonSerializable(includeIfNull: false)
class LegislatureVoteCollection {
  const LegislatureVoteCollection({required this.votes});
  final List<LegislatureVoteEntry> votes;

  factory LegislatureVoteCollection.fromJson(Map<String, dynamic> json) => _$LegislatureVoteCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureVoteCollectionToJson(this);
}
