import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/finance/appropriation_entry.dart';

part 'appropriation_collection.g.dart';

/// Appropriation Collection
@JsonSerializable(includeIfNull: false)
class FinanceAppropriationCollection {
  const FinanceAppropriationCollection({required this.appropriations});
  final List<FinanceAppropriationEntry> appropriations;

  factory FinanceAppropriationCollection.fromJson(Map<String, dynamic> json) => _$FinanceAppropriationCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceAppropriationCollectionToJson(this);
}
