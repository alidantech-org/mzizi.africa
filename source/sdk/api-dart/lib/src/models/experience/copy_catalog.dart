import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/experience/copy_entry.dart';

part 'copy_catalog.g.dart';

/// Copy Catalog
@JsonSerializable(includeIfNull: false)
class ExperienceCopyCatalog {
  const ExperienceCopyCatalog({required this.entries, required this.languageCode});
  final List<ExperienceCopyEntry> entries;
  final String languageCode;

  factory ExperienceCopyCatalog.fromJson(Map<String, dynamic> json) => _$ExperienceCopyCatalogFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceCopyCatalogToJson(this);
}
