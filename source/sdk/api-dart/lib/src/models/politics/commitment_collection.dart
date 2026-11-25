import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/politics/commitment_entry.dart';

part 'commitment_collection.g.dart';

/// Commitment Collection
@JsonSerializable(includeIfNull: false)
class PoliticsCommitmentCollection {
  const PoliticsCommitmentCollection({required this.commitments});
  final List<PoliticsCommitmentEntry> commitments;

  factory PoliticsCommitmentCollection.fromJson(Map<String, dynamic> json) => _$PoliticsCommitmentCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsCommitmentCollectionToJson(this);
}
