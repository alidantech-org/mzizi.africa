import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/explorer/copy_entry.dart';

part 'copy_bundle.g.dart';

/// Copy Bundle
@JsonSerializable(includeIfNull: false)
class ExplorerCopyBundle {
  const ExplorerCopyBundle({required this.entries, required this.hash, required this.language, required this.missing});
  final List<ExplorerCopyEntry> entries;
  final String hash;
  final String language;
  final List<String> missing;

  factory ExplorerCopyBundle.fromJson(Map<String, dynamic> json) => _$ExplorerCopyBundleFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerCopyBundleToJson(this);
}
