import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/country_entry.dart';

part 'country_collection.g.dart';

/// Country Collection
@JsonSerializable(includeIfNull: false)
class ReferenceCountryCollection {
  const ReferenceCountryCollection({required this.countries});
  final List<ReferenceCountryEntry> countries;

  factory ReferenceCountryCollection.fromJson(Map<String, dynamic> json) => _$ReferenceCountryCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceCountryCollectionToJson(this);
}
