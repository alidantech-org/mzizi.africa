import 'package:json_annotation/json_annotation.dart';
import 'scheme_entry.dart';

part 'scheme_collection.g.dart';

/// Scheme Collection
@JsonSerializable(includeIfNull: false)
class SchemeCollection {
  const SchemeCollection({
    required this.schemes,
  });
  final List<SchemeEntry> schemes;

  factory SchemeCollection.fromJson(Map<String, dynamic> json) => _$SchemeCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$SchemeCollectionToJson(this);
}