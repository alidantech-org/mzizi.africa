import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legal/provision_entry.dart';

part 'provision_collection.g.dart';

/// Provision Collection
@JsonSerializable(includeIfNull: false)
class LegalProvisionCollection {
  const LegalProvisionCollection({required this.provisions});
  final List<LegalProvisionEntry> provisions;

  factory LegalProvisionCollection.fromJson(Map<String, dynamic> json) => _$LegalProvisionCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$LegalProvisionCollectionToJson(this);
}
