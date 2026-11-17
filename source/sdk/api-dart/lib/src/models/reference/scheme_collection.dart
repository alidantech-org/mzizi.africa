import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/scheme_entry.dart';

part 'scheme_collection.g.dart';

/// Scheme Collection
@JsonSerializable(includeIfNull: false)
class ReferenceSchemeCollection {
  const ReferenceSchemeCollection({required this.schemes});
  final List<ReferenceSchemeEntry> schemes;

  factory ReferenceSchemeCollection.fromJson(Map<String, dynamic> json) => _$ReferenceSchemeCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceSchemeCollectionToJson(this);
}
