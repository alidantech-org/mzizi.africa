import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/currency_entry.dart';

part 'currency_collection.g.dart';

/// Currency Collection
@JsonSerializable(includeIfNull: false)
class ReferenceCurrencyCollection {
  const ReferenceCurrencyCollection({required this.currencies});
  final List<ReferenceCurrencyEntry> currencies;

  factory ReferenceCurrencyCollection.fromJson(Map<String, dynamic> json) => _$ReferenceCurrencyCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceCurrencyCollectionToJson(this);
}
