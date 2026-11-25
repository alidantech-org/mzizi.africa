import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/politics/party_entry.dart';

part 'party_collection.g.dart';

/// Party Collection
@JsonSerializable(includeIfNull: false)
class PoliticsPartyCollection {
  const PoliticsPartyCollection({required this.parties});
  final List<PoliticsPartyEntry> parties;

  factory PoliticsPartyCollection.fromJson(Map<String, dynamic> json) => _$PoliticsPartyCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsPartyCollectionToJson(this);
}
