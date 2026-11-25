import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/tender_entry.dart';

part 'tender_collection.g.dart';

/// Tender Collection
@JsonSerializable(includeIfNull: false)
class CivicTenderCollection {
  const CivicTenderCollection({required this.tenders});
  final List<CivicTenderEntry> tenders;

  factory CivicTenderCollection.fromJson(Map<String, dynamic> json) => _$CivicTenderCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$CivicTenderCollectionToJson(this);
}
