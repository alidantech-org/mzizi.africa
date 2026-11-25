import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/finance/finding_entry.dart';

part 'finding_collection.g.dart';

/// Finding Collection
@JsonSerializable(includeIfNull: false)
class FinanceFindingCollection {
  const FinanceFindingCollection({required this.findings});
  final List<FinanceFindingEntry> findings;

  factory FinanceFindingCollection.fromJson(Map<String, dynamic> json) => _$FinanceFindingCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceFindingCollectionToJson(this);
}
