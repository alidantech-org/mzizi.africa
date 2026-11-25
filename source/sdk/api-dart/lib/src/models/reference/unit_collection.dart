import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/unit_entry.dart';

part 'unit_collection.g.dart';

/// Unit Collection
@JsonSerializable(includeIfNull: false)
class ReferenceUnitCollection {
  const ReferenceUnitCollection({required this.units});
  final List<ReferenceUnitEntry> units;

  factory ReferenceUnitCollection.fromJson(Map<String, dynamic> json) => _$ReferenceUnitCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceUnitCollectionToJson(this);
}
