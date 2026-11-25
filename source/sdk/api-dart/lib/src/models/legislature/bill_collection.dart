import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legislature/bill_entry.dart';

part 'bill_collection.g.dart';

/// Bill Collection
@JsonSerializable(includeIfNull: false)
class LegislatureBillCollection {
  const LegislatureBillCollection({required this.bills});
  final List<LegislatureBillEntry> bills;

  factory LegislatureBillCollection.fromJson(Map<String, dynamic> json) => _$LegislatureBillCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureBillCollectionToJson(this);
}
